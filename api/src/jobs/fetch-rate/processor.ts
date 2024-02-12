import { oxr } from "@/common/shared/api";
import { CurrencyRate, Prisma, prisma } from "@/common/shared/prisma";
import { Processor } from "@nestjs/bull";
import { ForbiddenException, Logger } from "@nestjs/common";
import { NAME } from ".";
import { IConsumer, createInstance } from "@/common/types/bull";
import { DoneCallback, Job } from "bull";

@Processor(NAME)
export class FetchRateConsumer implements IConsumer<unknown> {
    private readonly logger: Logger = new Logger(FetchRateConsumer.name);
    constructor () {}

    private async execute(job: Job<unknown>): Promise<Array<CurrencyRate>> {
        const currencies = await prisma.currency.findMany({
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
            const LOG_MSG = `Fetched rate for ${currency.symbol} to ${SYMBOL} with rate ${rate}`;
            await Promise.all([this.logger.log(LOG_MSG), job.log(LOG_MSG)]);
            return () => prisma.currencyRate.create({
                data: {
                    currency_id: currency.id,
                    symbol: SYMBOL,
                    rate,
                },
            });
        }).filter(Boolean));
        const created = await prisma.$transaction(transactions.filter(tx => typeof tx === "function").map(tx => tx()));
        if (created.length <= 0) throw new ForbiddenException('Failed to create rates');
        await Promise.all([this.logger.log(`Done`), job.log(`Done`)]);

        return created;
    }

    async process (job: Job<unknown>, cb: DoneCallback) {
        await job.progress(0);
        const executed = await this.execute(job);
        cb(null, executed);
        await job.finished();
    }
}
export default createInstance(FetchRateConsumer)