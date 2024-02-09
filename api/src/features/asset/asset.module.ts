import { Module } from "@nestjs/common";
import { AssetController } from "./asset.controller";
import { CoinListingUsecase } from "./usecases/coin-listing.usecase";
import { CoinBalanceUsecase } from "./usecases/coin-balance.usecase";

@Module({
    imports: [],
    controllers: [AssetController],
    providers: [
        CoinListingUsecase,
        CoinBalanceUsecase,
    ],
})
export class AssetModule {}