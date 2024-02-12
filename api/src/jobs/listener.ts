import { ApiSchema } from "@/common/decorators/schema";
import { snakeToPascal } from "@/common/helpers/string";
import { InjectQueue, OnGlobalQueueActive, OnGlobalQueueCompleted, OnGlobalQueueWaiting, Processor } from "@nestjs/bull";
import { Logger, OnModuleInit } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Job, Queue } from "bull";

export function createListener(name: string) {
    @Processor(name)
    @ApiSchema({name: `${snakeToPascal(name)}Listener`})
    class Listener implements OnModuleInit {
        readonly logger: Logger = new Logger(Listener.name);
        constructor (
            @InjectQueue(name) readonly queue: Queue,
            readonly eventEmitter: EventEmitter2,
        ) {
            Object.assign(this, {name})
        }
    
        onModuleInit() {
            this.logger.debug(`Listener for ${Listener.name} initialized`);
        }
    
        @OnGlobalQueueWaiting({name})
        async onWaiting (jobId: number | string) {
            const job = await this.queue.getJob(jobId);
            if (!job) return;
            this.logger.debug(`Job ${job.name} #${jobId} is waiting to process`);
        }
    
        @OnGlobalQueueCompleted({name})
        async onCompleted(jobId: number | string, result: Array<any>) {
            const job = await this.queue.getJob(jobId);
            if (!job) return;
            this.logger.debug(`Job ${job.name} #${jobId} completed with result ${result.length} bytes`);
            for (const data of result) this.eventEmitter.emit(name, data);
        }
    
        @OnGlobalQueueActive({name})
        async onActive(job: Job) {
            this.logger.debug(`Processing job #${job.id} on '${job.name}'`);
        }
    }
    return Listener;
}