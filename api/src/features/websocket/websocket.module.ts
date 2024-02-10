import { Module } from "@nestjs/common";
import { FetchQuoteUsecase } from "./usecases/fetch-quote.usecase";
import { WebSocketService } from "./websocket.service";
import { FetchRateUsecase } from "./usecases/fetch-rate.usecase";

@Module({
    imports: [],
    controllers: [],
    providers: [
        WebSocketService,
        FetchQuoteUsecase,
        FetchRateUsecase,
    ],
})
export class WebSocketModule {}