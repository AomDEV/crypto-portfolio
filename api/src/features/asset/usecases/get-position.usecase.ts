import { BaseUsecase } from "@/common/shared/usecase";
import { NotFoundException } from "@nestjs/common";
import { Account } from "@prisma/client";

type GetPositionUsecaseProps = {
    asset_id: string;
    page: number;
    limit: number;
    session: Account;
};

export class GetPositionUsecase extends BaseUsecase<Promise<any>> {
    constructor () {
        super();
    }

    async execute({
        asset_id,
        page,
        limit,
        session,
    }: GetPositionUsecaseProps): Promise<any> {
        const asset = await this.prismaService.asset.findUnique({
            where: {
                id: asset_id,
                deleted_at: null,
            },
        });
        if (!asset) throw new NotFoundException('Asset not found');

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
        return { data, meta }
    }
}