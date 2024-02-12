import { ApiSchema } from "@/common/decorators/schema";
import { snakeToPascal } from "@/common/helpers/string";
import { OnGlobalQueueActive, OnGlobalQueueCompleted, OnGlobalQueueWaiting, Processor } from "@nestjs/bull";
import { Logger, OnModuleInit } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

export function createListener(name: string) {
    @Processor(name)
    @ApiSchema({name: `${snakeToPascal(name)}Listener`})
    class Listener implements OnModuleInit {
        readonly logger: Logger = new Logger(Listener.name);
        constructor (
            readonly eventEmitter: EventEmitter2
        ) {
            Object.assign(this, {name})
        }
    
        onModuleInit() {
            this.logger.debug(`Listener for ${Listener.name} initialized`);
        }
    
        @OnGlobalQueueWaiting()
        async onWaiting (jobId: number | string) {
            this.logger.debug(`Job #${jobId} is waiting to process`);
        }
    
        @OnGlobalQueueCompleted()
        async onCompleted(jobId: number | string, result: Array<any>) {
            this.logger.debug(`Job #${jobId} completed with result ${result.length} bytes`);
            for (const data of result) this.eventEmitter.emit(name, data);
        }
    
        @OnGlobalQueueActive()
        async onActive(jobId: number | string) {
            this.logger.debug(`Processing job #${jobId}`);
        }
    }
    return Listener;
}