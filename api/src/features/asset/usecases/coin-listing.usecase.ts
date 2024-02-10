import { BaseUsecase } from "@/common/shared/usecase";
import { Injectable } from "@nestjs/common";

type CoinListingUsecaseProps = {
    page: number;
    limit: number;
};

@Injectable()
export class CoinListingUsecase extends BaseUsecase<Promise<any>> {
    constructor() {
        super();
    }

    async execute({
        page,
        limit
    }: CoinListingUsecaseProps) {
        const [data, meta] = await this.pagination.asset.paginate({
            where: {
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
            }
        }).withPages({page, limit})
        return {
            data: data.map(asset => ({
                ...asset,
                quotes: undefined,
                quote: asset.quotes[0]
            })),
            meta
        }
    }
}