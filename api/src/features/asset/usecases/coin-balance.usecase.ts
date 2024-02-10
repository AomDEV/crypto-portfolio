import { BaseUsecase } from "@/common/shared/usecase";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Account } from "@prisma/client";
import BigNumber from "bignumber.js";
import { AssetService } from "../asset.service";

type CoinBalanceUsecaseProps = {
    asset_id: string;
    session: Account;
};

@Injectable()
export class CoinBalanceUsecase extends BaseUsecase<Promise<any>> {
    constructor (
        private readonly assetService: AssetService,
    ) {
        super();
    }

    async execute({
        asset_id,
        session
    }: CoinBalanceUsecaseProps): Promise<any> {
        const { id, quote } = await this.assetService.getAsset(asset_id);

        const { _sum: aggregate } = await this.prismaService.transaction.aggregate({
            where: {
                user_id: session.id,
                asset_id: id,
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
        const fiat = quote ? balance.multipliedBy(quote.price_thb).toNumber() : 0;
        
        return {
            quote,
            balance,
            fiat,
        }
    }
}