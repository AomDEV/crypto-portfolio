import { BadRequestException, Controller, Logger, Query, Req, Sse } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { EventService } from "./event.service";
import { Guest } from "@/common/decorators/guest";
import { Observable } from "rxjs";
import { EVENT } from "./constant";
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
    @ApiQuery({name: 'event', required: true, type: String, description: 'Event name to subscribe'})
    async sse (
        @Req() request: Request,
        @Query('event') event?: string,
    ): Promise<Observable<MessageEvent>> {
        request.on('close', (e) => {
            new Logger().warn('Connection closed', e);
        });

        return this.subscribeUsecase.execute({event});
    }
}