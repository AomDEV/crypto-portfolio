import { BaseUsecase } from "@/common/shared/usecase";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";

type CoinListingUsecaseProps = {
    page: number;
    limit: number;
};

@Injectable()
export class CoinListingUsecase extends BaseUsecase<Promise<any>> {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) {
        super();
    }

    async execute({
        page,
        limit
    }: CoinListingUsecaseProps) {
        const CACHE_KEY = `${CoinListingUsecase.name}:${page}:${limit}`;
        const cacheValues = await this.cacheManager.get(CACHE_KEY);
        if (cacheValues) return cacheValues;
         
        const [data, meta] = await this.pagination.asset.paginate({
            where: {
                deleted_at: null,
                rank: {
                    gt: 0
                },
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
            orderBy: {
                rank: "asc"
            },
        }).withPages({page, limit})
        const response = {
            data: data.map(asset => ({
                ...asset,
                quotes: undefined,
                quote: asset.quotes[0]
            })),
            meta
        }
        await this.cacheManager.set(CACHE_KEY, response, 60 * 1000);
        return response;
    }
}