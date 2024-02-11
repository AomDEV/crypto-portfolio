import { oxr } from "@/common/shared/api";
import { BaseUsecase } from "@/common/shared/usecase";
import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Prisma } from "@prisma/client";

@Injectable()
export class FetchRateUsecase extends BaseUsecase<Promise<void>> {
    private readonly logger: Logger = new Logger(FetchRateUsecase.name);

    constructor (
        private readonly eventEmitter: EventEmitter2
    ) {
        super();
    }

    async execute(): Promise<void> {
        const currencies = await this.prismaService.currency.findMany({
            where: {
                deleted_at: null,
            },
        });

        const SYMBOL = 'THB';
        const transactions: Array<() => Prisma.PrismaPromise<any>> = await Promise.all(currencies.map(async (currency) => {
            if (SYMBOL === currency.symbol) return null;
            const { data: exchange } = await oxr().get('/api/latest.json', {
                params: {
                    app_id: process.env.OXR_APP_ID,
                    base: currency.symbol,
                    symbols: SYMBOL,
                },
            });
            const rate = exchange.rates[SYMBOL];
            this.logger.log(`Fetched rate for ${currency.symbol} to ${SYMBOL} with rate ${rate}`);
            return () => this.prismaService.currencyRate.create({
                data: {
                    currency_id: currency.id,
                    symbol: SYMBOL,
                    rate,
                },
            });
        }).filter(Boolean));
        const created = await this.prismaService.$transaction(transactions.filter(tx => typeof tx === "function").map(tx => tx()));
        if (created.length <= 0) throw new ForbiddenException('Failed to create rates');

        const eventName = 'rate.fetched';
        for (const data of created) this.eventEmitter.emit(eventName, data);
    }
}