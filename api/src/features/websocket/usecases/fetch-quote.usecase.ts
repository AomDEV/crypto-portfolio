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

        const exchangeRate = await this.prismaService.currency.findUnique({
            where: {
                symbol: 'USD',
                deleted_at: null,
            },
            include: {
                rates: {
                    where: {
                        symbol: 'THB',
                        deleted_at: null,
                    },
                    take: 1,
                },
            },
        });
        if (!exchangeRate || exchangeRate.rates.length <= 0) return this.logger.error('Failed to fetch exchange rate');

        const transactions: Array<() => Prisma.PrismaPromise<any>> = await Promise.all(assets.map(async (asset) => {
            const { data: quotes } = await coincap().get(`/v2/assets`, {
                params: {
                    search: asset.symbol,
                },
            });
            const quote = quotes.data.find(quote => quote.symbol === asset.symbol);
            if (!quote) return null;

            this.logger.log(`Fetched quote for ${asset.symbol} with price ${quote.priceUsd}`);
            return () => this.prismaService.assetQuote.create({
                data: {
                    asset_id: asset.id,
                    rank: parseInt(quote.rank),
                    price_usd: parseFloat(quote.priceUsd),
                    volumn_usd: parseFloat(quote.volumeUsd24Hr),
                    price_thb: exchangeRate.rates[0].rate.mul(quote.priceUsd)?.toNumber() ?? 0,
                    volumn_thb: exchangeRate.rates[0].rate.mul(quote.volumeUsd24Hr)?.toNumber() ?? 0,
                    percent_change: parseFloat(quote.changePercent24Hr),
                }
            });
        }));

        const created = await this.prismaService.$transaction(transactions.filter(tx => typeof tx === "function").map(tx => tx()));
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