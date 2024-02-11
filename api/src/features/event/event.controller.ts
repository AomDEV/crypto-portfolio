import { Controller, Logger, ParseBoolPipe, Query, Req, Sse } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { Guest } from "@/common/decorators/guest";
import { Observable } from "rxjs";
import { SubscribeUsecase } from "./usecases/subscribe.usecase";
import { Request } from "express";

@Controller({path: 'event', version: '1'})
@ApiTags('Event')
export class EventController {
    constructor (
        private readonly subscribeUsecase: SubscribeUsecase,
    ) {}

    @Sse('sse')
    @Guest()
    @ApiQuery({ name: 'event', required: true, type: String, description: 'Event name to subscribe' })
    @ApiQuery({ name: 'merged', required: false, type: Boolean, description: 'Whether to include event type in response', example: false })
    async sse (
        @Req() request: Request,
        @Query('merged', ParseBoolPipe) merged: boolean,
        @Query('event') event?: string,
    ): Promise<Observable<MessageEvent>> {
        request.on('close', (e) => {
            new Logger().warn('Connection closed', e);
        });

        return this.subscribeUsecase.execute({event, merged});
    }
}