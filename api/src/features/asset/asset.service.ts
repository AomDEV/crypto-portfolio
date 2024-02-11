import { Asset, AssetQuote, EPositionStatus, prisma } from "@/common/shared/prisma";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Decimal } from "@prisma/client/runtime/library";

@Injectable()
export class AssetService {
    constructor () {}

    async getAsset(asset_id: string): Promise<Omit<Asset, "quotes"> & {quote: AssetQuote}> {
        const asset = await prisma.asset.findUnique({
            where: {
                id: asset_id,
                deleted_at: null,
            },
            include: {
                quotes: {
                    where: {
                        deleted_at: null,
                    },
                    orderBy: {
                        created_at: 'desc',
                    },
                    take: 1,
                }
            },
        });
        if (!asset) throw new NotFoundException('Asset not found');
        const quote = asset.quotes[0];
        delete asset.quotes;
        return {
            ...asset,
            quote,
        };
    }

    async getPositionProfit(position_id: string) {
        const position = await prisma.assetPosition.findUnique({
            where: {
                id: position_id,
                deleted_at: null,
            },
        });
        if (!position) throw new NotFoundException('Position not found');

        if (position.status !== EPositionStatus.CLOSE) {
            const asset = await this.getAsset(position.asset_id);
            position.exit_price = new Decimal(asset.quote.price_thb);
        }
        
        const rawProfit = position.exit_price.sub(position.entry_price).mul(position.leverage).mul(position.amount.toString());
        const netProfit = rawProfit.minus(position.amount.toString());
        const percentage = netProfit.div(position.amount.toString()).mul(100);
        return {
            raw_profit: rawProfit,
            net_profit: netProfit,
            percentage: percentage.toNumber(),
        }
    }
}