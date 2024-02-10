import { coincap } from "@/common/shared/api";
import { Prisma, prisma } from "@/common/shared/prisma";
import { BaseUsecase } from "@/common/shared/usecase";
import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class FetchQuoteUsecase extends BaseUsecase<Promise<void>> {
    private readonly logger: Logger = new Logger(FetchQuoteUsecase.name);
    constructor (
        private readonly eventEmitter: EventEmitter2
    ) {
        super();
    }

    async execute(): Promise<void> {
        // Fetch quotes from external API
        const assets = await prisma.asset.findMany({
            where: {
                deleted_at: null,
            },
        });
        const { data: quotes } = await coincap().get(`/v2/assets`, {
            params: {
                ids: assets.map(asset => asset.slug).join(','), 
            },
        });

        const exchangeRate = await this.prismaService.currency.findUnique({
            where: {
                symbol: 'USD',
                deleted_at: null,
            },
            include: {
                rates: {
                    where: {
                        currency: {
                            symbol: 'THB',
                        },
                        deleted_at: null,
                    },
                    take: 1,
                },
            },
        });
        
        const transactions: Array<Prisma.PrismaPromise<any>> = (quotes.data as any[]).map(quote => this.prismaService.assetQuote.create({
            data: {
                asset_id: assets.find(asset => asset.slug === quote.id).id,
                price_usd: parseFloat(quote.priceUsd),
                price_thb: exchangeRate.rates[0].rate.mul(quote.priceUsd).toNumber(),
            }
        }));
        const created = await this.prismaService.$transaction(transactions);
        if (created.length <= 0) throw new ForbiddenException('Failed to create quotes');
        this.logger.log(`Fetched ${created.length} quotes`);

        const eventName = 'quote.fetched';
        const listenerCount = this.eventEmitter.listenerCount(eventName);
        if (listenerCount > 0) {
            for (const data of created) {
                const emitter = this.eventEmitter.emit(eventName, data);
                if (!emitter) throw new ForbiddenException('Failed to send event');
            }
        }
    }
}