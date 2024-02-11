import { BaseUsecase } from "@/common/shared/usecase";
import { Account } from "@prisma/client";
import { AssetService } from "../asset.service";
import { Injectable, NotFoundException } from "@nestjs/common";

type GetPositionUsecaseProps = {
    asset_id: string;
    position_id?: string;
    page?: number;
    limit?: number;
    session: Account;
};

@Injectable()
export class GetPositionUsecase extends BaseUsecase<Promise<any>> {
    constructor (
        private readonly assetService: AssetService,
    ) {
        super();
    }

    async execute({
        asset_id,
        position_id,
        page,
        limit,
        session,
    }: GetPositionUsecaseProps): Promise<any> {
        const asset = await this.assetService.getAsset(asset_id);

        if (position_id) { 
            const position = await this.prismaService.assetPosition.findUnique({
                where: {
                    asset_id: asset.id,
                    user_id: session.id,
                    id: position_id,
                    deleted_at: null,
                },
            });
            if (!position) throw new NotFoundException('Position not found');
            const performance = await this.assetService.getPositionPerformance(position_id);
            return Object.assign(position, { performance });
        }

        const [data, meta] = await this.pagination.assetPosition.paginate({
            where: {
                asset_id: asset.id,
                user_id: session.id,
                deleted_at: null,
            },
            orderBy: {
                created_at: 'desc',
            },
        }).withPages({ page, limit });
        return {
            data: await Promise.all(data.map(async (position) => ({
                ...position,
                performance: await this.assetService.getPositionPerformance(position.id)
            }))),
            meta
        }
    }
}