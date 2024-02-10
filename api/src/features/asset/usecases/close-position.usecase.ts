import { BaseUsecase } from "@/common/shared/usecase";
import { Account, AssetPosition, EPositionStatus } from "@prisma/client";
import { ClosePositionDTO } from "../dto/close-position.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { isUUID } from "class-validator";
import { TYPES } from "@/common/constants/transaction";
import BigNumber from "bignumber.js";
import { AssetService } from "../asset.service";

type ClosePositionUsecaseProps = {
    asset_id: string;
    body: ClosePositionDTO;
    session: Account;
};

export class ClosePositionUsecase extends BaseUsecase<Promise<AssetPosition>> {
    constructor (
        private readonly assetService: AssetService,
    ) {
        super();
    }

    async execute({
        asset_id,
        body,
        session,
    }: ClosePositionUsecaseProps): Promise<AssetPosition> {
        if (!isUUID(asset_id)) throw new BadRequestException('Invalid asset_id');

        const asset = await this.assetService.getAsset(asset_id);
        
        const { position, raw_profit, net_profit } = await this.assetService.getPositionProfit(body.position_id);

        return this.prismaService.assetPosition.update({
            where: {
                id: position.id,
            },
            data: {
                exit_price: position.exit_price,
                profit: BigInt(net_profit.toString()),
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
                        out: raw_profit.isNegative() ? BigInt(raw_profit.abs().minus(position.amount.toString()).toString()) : 0,
                        in: raw_profit.isPositive() ? BigInt(raw_profit.toString()) : 0,
                    }
                }
            },
        });
    }
}