import { Module } from "@nestjs/common";
import { FetchQuoteUsecase } from "./usecases/fetch-quote.usecase";
import { EventService } from "./event.service";
import { FetchRateUsecase } from "./usecases/fetch-rate.usecase";
import { EventController } from "./event.controller";

@Module({
    imports: [],
    controllers: [EventController],
    providers: [
        EventService,
        
        FetchQuoteUsecase,
        FetchRateUsecase,
    ],
})
export class EventModule {}