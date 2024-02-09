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
            }
        }).withPages({page, limit})
        return {data, meta}
    }
}