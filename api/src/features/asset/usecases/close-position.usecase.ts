import { BaseUsecase } from "@/common/shared/usecase";
import { Account, AssetPosition, EPositionStatus } from "@prisma/client";
import { ClosePositionDTO } from "../dto/close-position.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { isUUID } from "class-validator";
import { TYPES } from "@/common/constants/transaction";
import BigNumber from "bignumber.js";

type ClosePositionUsecaseProps = {
    asset_id: string;
    body: ClosePositionDTO;
    session: Account;
};

export class ClosePositionUsecase extends BaseUsecase<Promise<AssetPosition>> {
    constructor () {
        super();
    }

    async execute({
        asset_id,
        body,
        session,
    }: ClosePositionUsecaseProps): Promise<AssetPosition> {
        if (!isUUID(asset_id)) throw new BadRequestException('Invalid asset_id');

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
                    orderBy: {
                        created_at: 'desc',
                    },
                    take: 1,
                }
            },
        });
        if (!asset) throw new NotFoundException('Asset not found');

        const position = await this.prismaService.assetPosition.findUnique({
            where: {
                id: body.position_id,
                user_id: session.id,
                deleted_at: null,
            },
        });
        if (!position) throw new NotFoundException('Position not found');

        const exit_price = asset.quotes[0].price_thb;
        const profit = BigNumber(position.amount.toString()).multipliedBy(position.entry_price.sub(exit_price).mul(position.leverage).toNumber());
        return this.prismaService.assetPosition.update({
            where: {
                id: position.id,
            },
            data: {
                exit_price,
                profit: BigInt(profit.toString()),
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
                        out: profit.isNegative() ? BigInt(profit.abs().minus(position.amount.toString()).toString()) : 0,
                        in: profit.isPositive() ? BigInt(profit.toString()) : 0,
                    }
                }
            },
        });
    }
}