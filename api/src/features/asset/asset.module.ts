import { Module } from "@nestjs/common";
import { AssetController } from "./asset.controller";
import { CoinListingUsecase } from "./usecases/coin-listing.usecase";
import { CoinBalanceUsecase } from "./usecases/coin-balance.usecase";
import { OpenPositionUsecase } from "./usecases/open-position.usecase";
import { GetPositionUsecase } from "./usecases/get-position.usecase";

@Module({
    imports: [],
    controllers: [AssetController],
    providers: [
        CoinListingUsecase,
        CoinBalanceUsecase,
        GetPositionUsecase,
        OpenPositionUsecase,
    ],
})
export class AssetModule {}