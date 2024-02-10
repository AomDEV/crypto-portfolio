import { BaseUsecase } from "@/common/shared/usecase";
import { Injectable } from "@nestjs/common";
import { AssetService } from "../asset.service";

type CoinInfoUsecaseProps = {
    asset_id: string;
};

@Injectable()
export class CoinInfoUsecase extends BaseUsecase<Promise<any>> {
    constructor(
        private readonly assetService: AssetService,
    ) {
        super();
    }

    async execute({
        asset_id
    }: CoinInfoUsecaseProps) {
        return this.assetService.getAsset(asset_id);
    }
}