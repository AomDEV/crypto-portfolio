import { Body, Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CoinListingUsecase } from "./usecases/coin-listing.usecase";
import { ZERO_UUID } from "@/common/constants/uuid";
import { CoinBalanceUsecase } from "./usecases/coin-balance.usecase";
import { AuthSession } from "@/common/decorators/auth-session";
import { Account } from "@prisma/client";
import { OpenPositionUsecase } from "./usecases/open-position.usecase";
import { OpenPositionDTO } from "./dto/open-position.dto";
import { GetPositionUsecase } from "./usecases/get-position.usecase";
import { Guest } from "@/common/decorators/guest";
import { ClosePositionUsecase } from "./usecases/close-position.usecase";
import { CoinInfoUsecase } from "./usecases/coin-info.usecase";

@Controller({
    version: '1',
    path: 'asset',
})
@ApiTags('Asset')
export class AssetController {
    constructor (
        private readonly coinInfoUsecase: CoinInfoUsecase,
        private readonly coinListingUsecase: CoinListingUsecase,
        private readonly coinBalanceUsecase: CoinBalanceUsecase,
        private readonly getPositionUsecase: GetPositionUsecase,
        private readonly openPositionUsecase: OpenPositionUsecase,
        private readonly closePositionUsecase: ClosePositionUsecase,
    ) {}

    @Get()
    @Guest()
    @ApiOperation({ summary: 'Get coin listing' })
    @ApiQuery({ name: 'page', required: true, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: true, type: Number, example: 10 })
    async listing (
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
    ) {
        return this.coinListingUsecase.execute({
            page,
            limit,
        });
    }

    @Get(':asset_id')
    @Guest()
    @ApiOperation({ summary: 'Get coin info' })
    @ApiParam({ name: 'asset_id', required: true, type: String, example: ZERO_UUID })
    async info (
        @Param('asset_id', ParseUUIDPipe) asset_id: string,
    ) {
        return this.coinInfoUsecase.execute({ asset_id });
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
    @Get(':asset_id/position')
    @ApiOperation({ summary: 'Get perpetual positions' })
    @ApiParam({ name: 'asset_id', required: true, type: String, example: ZERO_UUID })
    @ApiQuery({ name: 'page', required: true, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: true, type: Number, example: 10 })
    async position (
        @Param('asset_id', ParseUUIDPipe) asset_id: string,
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
        @AuthSession() session: Account,
    ) {
        return this.getPositionUsecase.execute({
            asset_id,
            page,
            limit,
            session,
        });
    }

    @ApiBearerAuth()
    @Get(':asset_id/position/:position_id')
    @ApiOperation({ summary: 'Get perpetual position' })
    @ApiParam({ name: 'asset_id', required: true, type: String, example: ZERO_UUID })
    @ApiParam({ name: 'position_id', required: true, type: String, example: ZERO_UUID })
    async positionDetail (
        @Param('asset_id', ParseUUIDPipe) asset_id: string,
        @Param('position_id', ParseUUIDPipe) position_id: string,
        @AuthSession() session: Account,
    ) {
        return this.getPositionUsecase.execute({
            asset_id,
            position_id,
            session,
        });
    }

    @ApiBearerAuth()
    @Post(':asset_id/position/open')
    @ApiOperation({ summary: 'Open perpetual position' })
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

    @ApiBearerAuth()
    @Post(':asset_id/position/:position_id/close')
    @ApiOperation({ summary: 'Close perpetual position' })
    @ApiParam({ name: 'asset_id', required: true, type: String, example: ZERO_UUID })
    @ApiParam({ name: 'position_id', required: true, type: String, example: ZERO_UUID })
    async closePosition (
        @Param('asset_id', ParseUUIDPipe) asset_id: string,
        @Param('position_id', ParseUUIDPipe) position_id: string,
        @AuthSession() session: Account,
    ) {
        return this.closePositionUsecase.execute({
            asset_id,
            position_id,
            session,
        });
    }
}