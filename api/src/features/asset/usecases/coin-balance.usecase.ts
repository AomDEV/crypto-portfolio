import { BaseUsecase } from "@/common/shared/usecase";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Account } from "@prisma/client";
import BigNumber from "bignumber.js";

type CoinBalanceUsecaseProps = {
    asset_id: string;
    session: Account;
};

@Injectable()
export class CoinBalanceUsecase extends BaseUsecase<Promise<any>> {
    constructor () {
        super();
    }

    async execute({
        asset_id,
        session
    }: CoinBalanceUsecaseProps): Promise<any> {
        const asset = await this.prismaService.asset.findUnique({
            where: {
                id: asset_id,
                deleted_at: null,
            },
            include: {
                quotes: {
                    where: {
                        deleted_at: null,
                    },
                    take: 1,
                }
            },
        });
        if (!asset) throw new NotFoundException('Asset not found');

        const { _sum: aggregate } = await this.prismaService.transaction.aggregate({
            where: {
                user_id: session.id,
                asset_id,
                deleted_at: null,
                in: {
                    gte: 0,
                },
                out: {
                    gte: 0
                },
            },
            _sum: {
                in: true,
                out: true,
            }
        });
        const { in: inAmount, out: outAmount } = aggregate;
        const balance = BigNumber(inAmount?.toString() ?? "0").minus(BigNumber(outAmount?.toString() ?? "0"));
        const fiat = asset.quotes.length <= 0 ? 0 : balance.multipliedBy(asset.quotes[0].price_thb).toNumber();
        
        return {
            asset: {
                ...asset,
                quotes: undefined,
                quote: asset.quotes[0],
            },
            balance,
            fiat,
        }
    }
}