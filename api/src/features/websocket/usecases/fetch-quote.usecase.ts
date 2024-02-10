import { coincap } from "@/common/shared/api";
import { prisma } from "@/common/shared/prisma";
import { BaseUsecase } from "@/common/shared/usecase";
import { ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class FetchQuoteUsecase extends BaseUsecase<Promise<void>> {
    constructor () {
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
        
        const created = await prisma.assetQuote.createMany({
            data: quotes.data.map(quote => ({
                asset_id: assets.find(asset => asset.slug === quote.id).id,
                price_usd: parseFloat(quote.priceUsd),
                price_thb: exchangeRate.rates[0].rate.mul(quote.priceUsd).toNumber(),
            })),
        });
        if (created.count <= 0) throw new ForbiddenException('Failed to create quotes');
    }
}