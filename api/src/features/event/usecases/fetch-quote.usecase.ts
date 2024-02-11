import { coincap } from "@/common/shared/api";
import { AssetQuote, Prisma, prisma } from "@/common/shared/prisma";
import { BaseUsecase } from "@/common/shared/usecase";
import { ForbiddenException, Injectable, Logger, Scope } from "@nestjs/common";

@Injectable({
    scope: Scope.TRANSIENT,
})
export class FetchQuoteUsecase extends BaseUsecase<Promise<Array<AssetQuote>>> {
    private readonly logger: Logger = new Logger(FetchQuoteUsecase.name);
    constructor () {
        super();
    }

    async execute(): Promise<Array<AssetQuote>> {
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
        if (!exchangeRate || exchangeRate.rates.length <= 0) throw new ForbiddenException('Failed to fetch exchange rate');

        const transactions: Array<() => Prisma.PrismaPromise<any>> = await Promise.all(assets.map(async (asset) => {
            const { data: quotes } = await coincap().get(`/v2/assets`, {
                params: {
                    search: asset.symbol,
                },
            });
            const quote = quotes.data.find(quote => quote.symbol === asset.symbol);
            if (!quote) return null;

            this.logger.log(`Fetched quote for ${asset.symbol} with price ${quote.priceUsd}`);
            const updated = await this.prismaService.asset.update({
                where: {
                    id: asset.id,
                },
                data: {
                    rank: parseInt(quote?.rank ?? "0"),
                },
            });
            return () => this.prismaService.assetQuote.create({
                data: {
                    asset_id: updated.id,
                    price_usd: parseFloat(quote?.priceUsd ?? "0"),
                    volume_usd: parseFloat(quote?.volumeUsd24Hr ?? "0"),
                    price_thb: exchangeRate.rates[0].rate.mul(quote?.priceUsd ?? 0)?.toNumber() ?? 0,
                    volume_thb: exchangeRate.rates[0].rate.mul(quote?.volumeUsd24Hr ?? 0)?.toNumber() ?? 0,
                    percent_change: parseFloat(quote?.changePercent24Hr ?? "0"),
                }
            });
        }));

        const created = await this.prismaService.$transaction(transactions.filter(tx => typeof tx === "function").map(tx => tx()));
        if (created.length <= 0) throw new ForbiddenException('Failed to create quotes');
        this.logger.log(`Fetched ${created.length} quotes`);

        return created;
    }
}