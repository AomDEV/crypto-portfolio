import { Injectable, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { FetchQuoteUsecase } from "./usecases/fetch-quote.usecase";
import { FetchRateUsecase } from "./usecases/fetch-rate.usecase";
import { Observable, map } from "rxjs";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class WebSocketService implements OnModuleInit {
    constructor (
        private readonly fetchQuoteUsecase: FetchQuoteUsecase,
        private readonly fetchRateUsecase: FetchRateUsecase,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    subscribe (eventName: string) {
        const subscriber = new Observable((subscriber) => {
            this.eventEmitter.on(eventName, subscriber.next);
            return () => this.eventEmitter.off(eventName, subscriber.next);
        });
        return subscriber.pipe(map((message) => message));
    }

    @Cron(CronExpression.EVERY_30_SECONDS, {})
    getQuotes () {
        return this.fetchQuoteUsecase.execute();
    }

    @Cron(CronExpression.EVERY_HOUR, {})
    getRates () {
        return this.fetchRateUsecase.execute();
    }

    async onModuleInit() {
        const calls = [
            this.getQuotes(),
            this.getRates()
        ];
        await Promise.all(calls);
    }
}