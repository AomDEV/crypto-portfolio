import { BaseUsecase } from "@/common/shared/usecase";
import { Account, AssetPosition, EPositionStatus, Prisma } from "@prisma/client";
import { OpenPositionDTO } from "../dto/open-position.dto";
import BigNumber from "bignumber.js";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { cmc } from "@/common/shared/api";
import { TYPES } from "@/common/constants/transaction";
import { isUUID } from "class-validator";
import { AssetService } from "../asset.service";

type OpenPositionUsecaseProps = {
    asset_id: string;
    body: OpenPositionDTO;
    session: Account;
};

@Injectable()
export class OpenPositionUsecase extends BaseUsecase<Promise<AssetPosition>> {
    constructor (
        private readonly assetService: AssetService,
    ) {
        super();
    }

    async execute({
        asset_id,
        body,
        session,
    }: OpenPositionUsecaseProps): Promise<AssetPosition> {
        const { leverage, direction, amount } = body;

        if (!isUUID(asset_id)) throw new BadRequestException('Invalid asset_id');
        if (BigNumber(amount).isLessThanOrEqualTo(0)) throw new BadRequestException('Amount must be greater than 0');

        const asset = await this.assetService.getAsset(asset_id);
        if (!asset.quote) throw new NotFoundException('Quote not found');

        return this.prismaService.assetPosition.create({
            data: {
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
                leverage,
                direction,
                amount: new Prisma.Decimal(amount),
                entry_price: asset.quote.price_thb,
                status: EPositionStatus.OPEN,
                open_tx: {
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
                        type: TYPES.ENTRY_POSITION,
                        out: (amount),
                        in: 0
                    }
                },
            }
        });
    }
}