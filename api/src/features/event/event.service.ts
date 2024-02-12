import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { Observable, fromEvent, map, merge } from "rxjs";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EVENT } from "./constant";
import { createEvent } from "./helper";
import { InjectQueue } from "@nestjs/bull";
import { NAME as FETCH_QUOTE } from "@/jobs/fetch-quote";
import { NAME as FETCH_RATE } from "@/jobs/fetch-rate";
import { Queue } from "bull";

@Injectable()
export class EventService implements OnModuleInit, OnModuleDestroy {
    private readonly logger: Logger = new Logger(EventService.name);
    constructor (
        private readonly eventEmitter: EventEmitter2,
        @InjectQueue(FETCH_QUOTE) private readonly fetchQuoteQueue: Queue,
        @InjectQueue(FETCH_RATE) private readonly fetchRateQueue: Queue,
        private readonly schedulerRegistry: SchedulerRegistry
    ) {}

    subscribe<T>(eventName: string | string[], merged: boolean = false): Observable<MessageEvent<T>> {
        if (Array.isArray(eventName)) {
            const eventNames = eventName.length <= 0 ? Object.values(EVENT) : eventName;
            const events = eventNames.map(name => fromEvent(this.eventEmitter, name).pipe<MessageEvent<T>>(
                map((data: T) => createEvent(name, data, merged)),
            ));
            return merge(...events);
        }
        return fromEvent(this.eventEmitter, eventName).pipe<MessageEvent<T>>(
            map((data: T) => createEvent(eventName, data, merged)),
        );
    }

    emit<T>(name: string | string[], data: T) {
        this.logger.log(`Emitting event "${name}" with data ${JSON.stringify(data).length} bytes`);
        return this.eventEmitter.emit(name, data);
    }

    @Cron(CronExpression.EVERY_MINUTE, {})
    async getQuotes () {
        // send to queue `fetch-quote`
        const job = await this.fetchQuoteQueue.add(FETCH_QUOTE, {}, {
            attempts: 3,
            removeOnFail: true
        });
        if (!job) return;
        this.logger.debug(`Emitting '${job.name}' with job #${job.id}`);
    }

    @Cron(CronExpression.EVERY_HOUR, {})
    async getRates () {
        // send to queue `fetch-rate`
        const job = await this.fetchRateQueue.add(FETCH_RATE, {}, {
            attempts: 3,
            removeOnFail: true
        });
        if (!job) return;
        this.logger.debug(`Emitting '${job.name}' with job #${job.id}`);
    }

    @Cron(CronExpression.EVERY_5_SECONDS, {})
    async getHeartbeat () {
        return this.emit(EVENT.HEARTBEAT, {
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