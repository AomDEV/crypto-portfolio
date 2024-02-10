import { Module } from "@nestjs/common";
import { AssetController } from "./asset.controller";
import { CoinListingUsecase } from "./usecases/coin-listing.usecase";
import { CoinBalanceUsecase } from "./usecases/coin-balance.usecase";
import { OpenPositionUsecase } from "./usecases/open-position.usecase";
import { GetPositionUsecase } from "./usecases/get-position.usecase";
import { ClosePositionUsecase } from "./usecases/close-position.usecase";
import { AssetService } from "./asset.service";

@Module({
    imports: [],
    controllers: [AssetController],
    providers: [
        AssetService,
        CoinListingUsecase,
        CoinBalanceUsecase,
        GetPositionUsecase,
        OpenPositionUsecase,
        ClosePositionUsecase,
    ],
})
export class AssetModule {}