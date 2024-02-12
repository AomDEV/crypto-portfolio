import { Type } from "@nestjs/common";
import { DoneCallback, Job } from "bull";

export interface IConsumer<T extends unknown> {
    process: (job: Job<T>, cb: DoneCallback) => void | Promise<void>;
}
export function createInstance<T>(instance: Type<IConsumer<T>>) {
    return (job: Job, cb: DoneCallback) => {
        const _instance = new instance;
        return _instance.process(job, cb);
    }
}