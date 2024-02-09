import { Controller, Get, ParseIntPipe, Query } from "@nestjs/common";
import { CacheKey, CacheTTL } from "@nestjs/cache-manager";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CoinListingUsecase } from "./usecases/coin-listing.usecase";

@Controller('portfolio')
@ApiTags('Portfolio')
export class PortfolioController {
    constructor (
        private readonly coinListingUsecase: CoinListingUsecase,
    ) {}

    @Get('listing')
    @ApiOperation({ summary: 'Get coin listing' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @CacheKey('listing')
    @CacheTTL(60*1000)
    async listing (
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
    ) {
        return this.coinListingUsecase.execute({
            page,
            limit,
        });
    }
}