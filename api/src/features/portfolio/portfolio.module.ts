import { Module } from "@nestjs/common";
import { PortfolioController } from "./portfolio.controller";
import { CoinListingUsecase } from "./usecases/coin-listing.usecase";

@Module({
    imports: [],
    controllers: [PortfolioController],
    providers: [
        CoinListingUsecase,
    ],
})
export class PortfolioModule {}