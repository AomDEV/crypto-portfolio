import { Processor } from "@nestjs/bull";
import { Job } from "bull";
import { NAME } from ".";
import { IConsumer, createInstance } from "@/common/types/bull";
import { delay } from "@/common/helpers/time";

@Processor(NAME)
export class DefaultConsumer implements IConsumer<unknown> {
	async process(job: Job<unknown>) {
		console.log('Start processing job')
		let progress = 0;
		for (let i = 0; i < 100; i++) {
			await delay(500);
			progress += 1;
			await job.progress(progress);
		}
	}
}
export default createInstance(DefaultConsumer)