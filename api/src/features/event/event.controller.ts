import { Controller, Sse } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { EventService } from "./event.service";
import { Guest } from "@/common/decorators/guest";
import { Observable } from "rxjs";
import { AssetQuote, CurrencyRate } from "@prisma/client";

@Controller({path: 'event', version: '1'})
@ApiTags('Event')
export class EventController {
    constructor (
        private readonly eventService: EventService,
    ) {}

    @Sse('heartbeat')
    @Guest()
    async heartbeat (): Promise<Observable<MessageEvent>> {
        return this.eventService.subscribe<any>('heartbeat');
    }

    @Sse('quote')
    @Guest()
    async subscribeQuote (): Promise<Observable<MessageEvent<AssetQuote>>> {
        return this.eventService.subscribe<AssetQuote>('quote.fetched');
    }

    @Sse('rate')
    @Guest()
    subscribeRate (): Observable<MessageEvent<CurrencyRate>> {
        return this.eventService.subscribe<CurrencyRate>('rate.fetched');
    }
}