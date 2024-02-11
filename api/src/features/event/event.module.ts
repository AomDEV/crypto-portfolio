import { Module } from "@nestjs/common";
import { FetchQuoteUsecase } from "./usecases/fetch-quote.usecase";
import { EventService } from "./event.service";
import { FetchRateUsecase } from "./usecases/fetch-rate.usecase";
import { EventController } from "./event.controller";
import { SubscribeUsecase } from "./usecases/subscribe.usecase";

@Module({
    imports: [],
    controllers: [EventController],
    providers: [
        EventService,
        
        SubscribeUsecase,
        FetchQuoteUsecase,
        FetchRateUsecase,
    ],
})
export class EventModule {}