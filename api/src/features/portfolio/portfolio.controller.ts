import { Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Query } from "@nestjs/common";
import { CacheKey, CacheTTL } from "@nestjs/cache-manager";
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CoinListingUsecase } from "./usecases/coin-listing.usecase";
import { ZERO_UUID } from "@/common/constants/uuid";
import { CoinBalanceUsecase } from "./usecases/coin-balance.usecase";
import { AuthSession } from "@/common/decorators/auth-session";
import { Account } from "@prisma/client";

@Controller('portfolio')
@ApiTags('Portfolio')
export class PortfolioController {
    constructor (
        private readonly coinListingUsecase: CoinListingUsecase,
        private readonly coinBalanceUsecase: CoinBalanceUsecase,
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

    @Get(':asset_id/balance')
    @ApiOperation({ summary: 'Get coin balance' })
    @ApiParam({ name: 'asset_id', required: true, type: String, example: ZERO_UUID })
    async balance (
        @Param('asset_id', ParseUUIDPipe) asset_id: string,
        @AuthSession() session: Account,
    ) {
        return this.coinBalanceUsecase.execute({
            asset_id,
            session,
        });
    }
}