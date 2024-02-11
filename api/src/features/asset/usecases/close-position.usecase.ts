import { BaseUsecase } from "@/common/shared/usecase";
import { Account, AssetPosition, EPositionStatus, Prisma } from "@prisma/client";
import { BadRequestException, Injectable } from "@nestjs/common";
import { isUUID } from "class-validator";
import { TYPES } from "@/common/constants/transaction";
import { AssetService } from "../asset.service";
import BigNumber from "bignumber.js";

type ClosePositionUsecaseProps = {
    asset_id: string;
    position_id: string;
    session: Account;
};

@Injectable()
export class ClosePositionUsecase extends BaseUsecase<Promise<AssetPosition>> {
    constructor (
        private readonly assetService: AssetService,
    ) {
        super();
    }

    async execute({
        asset_id,
        position_id,
        session,
    }: ClosePositionUsecaseProps): Promise<AssetPosition> {
        if (!isUUID(asset_id)) throw new BadRequestException('Invalid asset_id');

        const asset = await this.assetService.getAsset(asset_id);
        
        const position = await this.prismaService.assetPosition.findUnique({
            where: {
                asset_id: asset.id,
                user_id: session.id,
                id: position_id,
                deleted_at: null,
            },
        });
        if (!position) throw new BadRequestException('Position not found');
        const { raw_profit, net_profit } = await this.assetService.getPositionPerformance(position_id);
        const rawProfit = BigNumber(raw_profit);
        const amount = BigNumber(position.amount.toString());

        return this.prismaService.assetPosition.update({
            where: {
                id: position.id,
            },
            data: {
                exit_price: asset.quote.price_thb,
                profit: (net_profit.toString()),
                status: EPositionStatus.CLOSE,
                exited_at: new Date(),
                close_tx: {
                    create: {
                        asset: {
                            connect: {
                                id: asset.id,
                            }
                        },
                        user: {
                            connect: {
                                id: session.id,
                            }
                        },
                        type: TYPES.EXIT_POSITION,
                        out: rawProfit.lt(amount) ? (rawProfit.abs().minus(position.amount.toString()).toString()) : 0,
                        in: rawProfit.gte(amount) ? (rawProfit.toString()) : 0,
                    }
                }
            },
        });
    }
}