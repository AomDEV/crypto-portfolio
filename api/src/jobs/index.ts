import { DynamicModule, Logger, MiddlewareConsumer, Module, NestModule, OnModuleInit, Provider, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { Queue } from "bull";
import { ExpressAdapter } from "@bull-board/express";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { createBullBoard } from "@bull-board/api"
import { getQueueToken } from "@nestjs/bull";
import { getModule as BullModule } from "@/common/providers/bull.provider";
import { getModule as BullBoardModule } from "@/common/providers/bull-board.provider";
import { Middleware } from "./middleware";
import { createListener } from "./listener";

// Import Jobs list
import * as DefaultJob from "./default";
import * as FetchQuoteJob from "./fetch-quote";
import * as FetchRateJob from "./fetch-rate";

// Jobs
export const JOBS = [
    DefaultJob,
    FetchQuoteJob,
    FetchRateJob,
];

export const ROUTE = '/queues';
export const NAMES = JOBS.map((job) => job.NAME);
export const MODULES = JOBS.map((job) => job.MODULE).flat();
export const FEATURES = JOBS.map((job) => job.FEATURE).flat();
export const PROVIDERS = JOBS.map((job) => job.PROVIDER).flat()

@Module({})
export class JobsModule implements NestModule, OnModuleInit {
    public queues: Queue[] = [];
    private readonly logger = new Logger(JobsModule.name);

    static register (): DynamicModule {
        return {
            module: JobsModule,
            imports: ([
                BullModule(),
                BullBoardModule()
            ] as Array<Type<any> | DynamicModule>).concat(MODULES).concat(FEATURES),
            providers: (PROVIDERS as Array<Type<any> | Provider>)
                .concat(MODULES.map((module) => module.providers).flat())
                .concat(NAMES.map((name) => {
                    return {
                        provide: `${name.toUpperCase()}_LISTENER`,
                        useClass: createListener(name)
                    };
                })),
            exports: MODULES.map((module) => module.exports).flat()
        }
    }

    constructor (
        private readonly moduleRef: ModuleRef
    ) {}

    configure(consumer: MiddlewareConsumer) {
        const serverAdapter = new ExpressAdapter();
        serverAdapter.setBasePath(ROUTE);

        this.queues = NAMES.map((name) => this.moduleRef.get(getQueueToken(name), { strict: false }));
        createBullBoard({
            queues: this.queues.map((queue) => new BullAdapter(queue)),
            serverAdapter,
        });

        consumer.apply(Middleware, serverAdapter.getRouter()).forRoutes(ROUTE);
    }

    onModuleInit() {
        return this.logger.log(`Worker PID: ${process.pid}`);
    }
}