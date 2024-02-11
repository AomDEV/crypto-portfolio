import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { FetchQuoteUsecase } from "./usecases/fetch-quote.usecase";
import { FetchRateUsecase } from "./usecases/fetch-rate.usecase";
import { Observable, fromEvent, map, merge } from "rxjs";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EVENT } from "./constant";

@Injectable()
export class EventService implements OnModuleInit, OnModuleDestroy {
    private readonly logger: Logger = new Logger(EventService.name);
    private events: string[] = [];
    constructor (
        private readonly eventEmitter: EventEmitter2,
        private readonly fetchQuoteUsecase: FetchQuoteUsecase,
        private readonly fetchRateUsecase: FetchRateUsecase,
        private readonly schedulerRegistry: SchedulerRegistry
    ) {}

    private addEvent(eventName: string) {
        const index = this.events.push(eventName);
        this.events = this.events.filter((value, index, self) => self.indexOf(value) === index);
        return index;
    }

    subscribe<T>(eventName: string | string[]): Observable<MessageEvent<T>> {
        if (Array.isArray(eventName)) {
            const eventNames = eventName.length <= 0 ? this.events : eventName;
            const events = eventNames.map(name => fromEvent(this.eventEmitter, name).pipe<MessageEvent<T>>(
                map((data: T) => new MessageEvent(name, { data })),
            ));
            return merge(...events);
        }
        return fromEvent(this.eventEmitter, eventName).pipe<MessageEvent<T>>(
            map((data: T) => new MessageEvent(eventName, { data })),
        );
    }

    emit<T>(name: string | string[], data: T) {
        this.logger.log(`Emitting event "${name}" with data ${JSON.stringify(data).length} bytes`);
        return this.eventEmitter.emit(name, data);
    }

    @Cron(CronExpression.EVERY_30_SECONDS, {})
    async getQuotes () {
        const created = await this.fetchQuoteUsecase.execute();
        return Promise.all(created.map(data => {
            const signatureEvent = `${EVENT.QUOTE}:${data.asset_id}`;
            this.addEvent(signatureEvent);
            return this.emit([EVENT.QUOTE, signatureEvent], data)
        }));
    }

    @Cron(CronExpression.EVERY_HOUR, {})
    async getRates () {
        const created = await this.fetchRateUsecase.execute();
        return Promise.all(created.map(data => {
            const signatureEvent = `${EVENT.RATE}:${data.currency_id}`;
            this.addEvent(signatureEvent);
            return this.emit([EVENT.RATE, signatureEvent], data)
        }));
    }

    @Cron(CronExpression.EVERY_5_SECONDS, {})
    async getHeartbeat () {
        const signatureEvent = EVENT.HEARTBEAT;
        this.addEvent(signatureEvent);
        return this.emit(signatureEvent, {
            time: new Date().getTime()
        });
    }

    async onModuleInit() {
        const calls = [
            this.getRates()
        ];
        await Promise.all(calls);
    }

    onModuleDestroy() {
        this.logger.warn('Destroying event service');
        this.eventEmitter.removeAllListeners();
        const jobs = this.schedulerRegistry.getCronJobs();
        for (const [name] of jobs.entries()) this.schedulerRegistry.deleteCronJob(name);
    }
}