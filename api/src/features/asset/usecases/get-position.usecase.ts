import { BaseUsecase } from "@/common/shared/usecase";
import { NotFoundException } from "@nestjs/common";
import { Account } from "@prisma/client";
import { AssetService } from "../asset.service";

type GetPositionUsecaseProps = {
    asset_id: string;
    page: number;
    limit: number;
    session: Account;
};

export class GetPositionUsecase extends BaseUsecase<Promise<any>> {
    constructor (
        private readonly assetService: AssetService,
    ) {
        super();
    }

    async execute({
        asset_id,
        page,
        limit,
        session,
    }: GetPositionUsecaseProps): Promise<any> {
        const asset = await this.assetService.getAsset(asset_id);

        const [data, meta] = await this.pagination.assetPosition.paginate({
            where: {
                asset_id: asset.id,
                user_id: session.id,
                deleted_at: null,
            },
            orderBy: {
                exited_at: 'asc',
                created_at: 'desc',
            },
        }).withPages({ page, limit });
        return {
            data: Promise.all(data.map(async (position) => ({
                ...position,
                profit: await this.assetService.getPositionProfit(position.id)
            }))),
            meta
        }
    }
}