import { Module } from "@nestjs/common";
import { FetchQuoteUsecase } from "./usecases/fetch-quote.usecase";
import { WebSocketService } from "./websocket.service";

@Module({
    imports: [],
    controllers: [],
    providers: [
        WebSocketService,
        FetchQuoteUsecase,
    ],
})
export class WebSocketModule {}