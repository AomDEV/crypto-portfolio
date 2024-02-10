import { SubscribeMessage, WebSocketGateway as WsGateway } from "@nestjs/websockets";
import { WebSocketService } from "./websocket.service";

@WsGateway(3001, { transports: ['websocket'] })
export class WebSocketGateway {
    constructor (
        private readonly websocketService: WebSocketService,
    ) {}

    @SubscribeMessage('quote')
    quote () {
        return this.websocketService.subscribe('quote');
    }

    @SubscribeMessage('rate')
    rate () {
        return this.websocketService.subscribe('rate');
    }
}