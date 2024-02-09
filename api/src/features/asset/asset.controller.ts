import { Body, Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { CacheKey, CacheTTL } from "@nestjs/cache-manager";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CoinListingUsecase } from "./usecases/coin-listing.usecase";
import { ZERO_UUID } from "@/common/constants/uuid";
import { CoinBalanceUsecase } from "./usecases/coin-balance.usecase";
import { AuthSession } from "@/common/decorators/auth-session";
import { Account } from "@prisma/client";
import { OpenPositionUsecase } from "./usecases/open-position.usecase";
import { OpenPositionDTO } from "./dto/open-position.dto";

@Controller('asset')
@ApiTags('Asset')
export class AssetController {
    constructor (
        private readonly coinListingUsecase: CoinListingUsecase,
        private readonly coinBalanceUsecase: CoinBalanceUsecase,
        private readonly openPositionUsecase: OpenPositionUsecase,
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

    @ApiBearerAuth()
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

    @ApiBearerAuth()
    @Post(':asset_id/position/open')
    @ApiOperation({ summary: 'Open position' })
    @ApiParam({ name: 'asset_id', required: true, type: String, example: ZERO_UUID })
    async openPosition (
        @Param('asset_id', ParseUUIDPipe) asset_id: string,
        @Body() body: OpenPositionDTO,
        @AuthSession() session: Account,
    ) {
        return this.openPositionUsecase.execute({
            asset_id,
            body,
            session,
        });
    }
}