import { BaseUsecase } from "@/common/shared/usecase";
import { Account, AssetPosition, EPositionStatus } from "@prisma/client";
import { OpenPositionDTO } from "../dto/open-position.dto";
import BigNumber from "bignumber.js";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { cmc } from "@/common/shared/cmc";
import { TYPES } from "@/common/constants/transaction";
import { isUUID } from "class-validator";

type OpenPositionUsecaseProps = {
    asset_id: string;
    body: OpenPositionDTO;
    session: Account;
};

export class OpenPositionUsecase extends BaseUsecase<Promise<AssetPosition>> {
    constructor () {
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

        const asset = await this.prismaService.asset.findUnique({
            where: {
                id: asset_id,
                deleted_at: null,
            },
        });
        if (!asset) throw new NotFoundException('Asset not found');

        const quotes = await cmc().get('/v2/cryptocurrency/quotes/latest', {
            params: {
                symbol: asset.symbol,
                convert: 'THB',
            }
        }).catch(() => null);
        const quote = quotes.data?.data?.[asset.symbol]?.quote?.THB?.price ?? 0;
        if (quote <= 0) throw new NotFoundException('Quote not found');

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
                amount: BigInt(amount),
                entry_price: quote,
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
                        out: BigInt(amount),
                        in: 0
                    }
                },
            }
        });
    }
}