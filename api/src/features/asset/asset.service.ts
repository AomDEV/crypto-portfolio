import { Asset, AssetQuote, EDirection, EPositionStatus, prisma } from "@/common/shared/prisma";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Decimal } from "@prisma/client/runtime/library";
import BigNumber from "bignumber.js";

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

    async getPositionPerformance(position_id: string) {
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
        
        const entryPrice = BigNumber(position.entry_price.toString());
        const exitPrice = BigNumber(position.exit_price.toString());
        const directionDivider = position.direction === EDirection.LONG ? entryPrice : exitPrice;
        const entryAmount = entryPrice.multipliedBy(position.amount.toString()).div(directionDivider);
        const exitAmount = exitPrice.multipliedBy(position.amount.toString()).div(directionDivider);
        const rawProfit = exitAmount.multipliedBy(position.leverage);
        const netProfit = rawProfit.minus(entryAmount).multipliedBy(position.leverage);
        const percentage = netProfit.div(entryAmount).multipliedBy(100);

        return {
            raw_profit: BigNumber(rawProfit.toString()).toFixed(0),
            net_profit: BigNumber(netProfit.toString()).toFixed(0),
            percentage: percentage.toNumber(),
        }
    }
}