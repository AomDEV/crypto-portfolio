import { Module } from "@nestjs/common";
import { FetchQuoteUsecase } from "./usecases/fetch-quote.usecase";
import { WebSocketService } from "./websocket.service";
import { FetchRateUsecase } from "./usecases/fetch-rate.usecase";
import { WebSocketGateway } from "./websocket.gateway";

@Module({
    imports: [],
    controllers: [],
    providers: [
        WebSocketGateway,
        WebSocketService,
        
        FetchQuoteUsecase,
        FetchRateUsecase,
    ],
})
export class WebSocketModule {}