import { BadRequestException, Controller, Query, Sse } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { EventService } from "./event.service";
import { Guest } from "@/common/decorators/guest";
import { Observable } from "rxjs";
import { EVENT } from "./constant";
import { SubscribeUsecase } from "./usecases/subscribe.usecase";

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
        @Query('event') event?: string
    ): Promise<Observable<MessageEvent>> {
        return this.subscribeUsecase.execute({event});
    }
}