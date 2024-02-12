import { coincap } from "@/common/shared/api";
import { AssetQuote, Prisma, prisma } from "@/common/shared/prisma";
import { Processor } from "@nestjs/bull";
import { ForbiddenException, Logger } from "@nestjs/common";
import { NAME } from ".";
import { IConsumer, createInstance } from "@/common/types/bull";
import { DoneCallback, Job } from "bull";

@Processor(NAME)
export class FetchQuoteConsumer implements IConsumer<unknown> {
    private readonly logger: Logger = new Logger(FetchQuoteConsumer.name);
    constructor () {}

    private async execute(job: Job<unknown>): Promise<Array<AssetQuote>> {
        // Fetch quotes from external API
        const assets = await prisma.asset.findMany({
            where: {
                deleted_at: null,
            },
        });

        const exchangeRate = await prisma.currency.findUnique({
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
        if (!exchangeRate || exchangeRate.rates.length <= 0) throw new ForbiddenException('Failed to fetch exchange rate');
        const [{rate}] = exchangeRate.rates;

        const transactions: Array<() => Prisma.PrismaPromise<any>> = await Promise.all(assets.map(async (asset, index) => {
            const { data: quotes } = await coincap().get(`/v2/assets`, {
                params: {
                    search: asset.symbol,
                },
            });
            const quote = quotes.data.find(quote => quote.symbol === asset.symbol);
            if (!quote) return null;

            const LOG_MSG = `Fetched quote for ${asset.symbol} with price ${quote.priceUsd}`;
            await Promise.all([this.logger.log(LOG_MSG), job.log(LOG_MSG)]);
            const updated = await prisma.asset.update({
                where: {
                    id: asset.id,
                },
                data: {
                    rank: parseInt(quote?.rank ?? "0"),
                },
            });
            await job.progress((index/assets.length) * 100)
            return () => prisma.assetQuote.create({
                data: {
                    asset_id: updated.id,
                    price_usd: parseFloat(quote?.priceUsd ?? "0"),
                    volume_usd: parseFloat(quote?.volumeUsd24Hr ?? "0"),
                    price_thb: rate.mul(quote?.priceUsd ?? 0)?.toNumber() ?? 0,
                    volume_thb: rate.mul(quote?.volumeUsd24Hr ?? 0)?.toNumber() ?? 0,
                    percent_change: parseFloat(quote?.changePercent24Hr ?? "0"),
                }
            });
        }));

        const created = await prisma.$transaction(transactions.filter(tx => typeof tx === "function").map(tx => tx()));
        if (created.length <= 0) throw new ForbiddenException('Failed to create quotes');
        await job.progress(100);
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
export default createInstance(FetchQuoteConsumer)