import { Module } from "@nestjs/common";
import { PortfolioController } from "./portfolio.controller";
import { CoinListingUsecase } from "./usecases/coin-listing.usecase";
import { CoinBalanceUsecase } from "./usecases/coin-balance.usecase";

@Module({
    imports: [],
    controllers: [PortfolioController],
    providers: [
        CoinListingUsecase,
        CoinBalanceUsecase,
    ],
})
export class PortfolioModule {}