import { Module } from "@nestjs/common";
import { EventService } from "./event.service";
import { EventController } from "./event.controller";
import { SubscribeUsecase } from "./usecases/subscribe.usecase";
import { MODULE as FetchQuoteModule } from "@/jobs/fetch-quote";
import { MODULE as FetchRateModule } from "@/jobs/fetch-rate";

@Module({
    imports: [
        FetchQuoteModule,
        FetchRateModule,
    ],
    controllers: [EventController],
    providers: [
        EventService,
        
        SubscribeUsecase,
    ],
})
export class EventModule {}