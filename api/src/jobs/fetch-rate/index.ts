import { BullModule } from "@nestjs/bull";
import { BullBoardModule } from "@bull-board/nestjs";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import processor, { FetchRateConsumer } from "./processor";

export const NAME = 'fetch-rate';
export const MODULE = BullModule.registerQueue({
    name: NAME,
    processors: [
        {
            name: NAME,
            callback: processor,
        }
    ],
});
export const FEATURE = BullBoardModule.forFeature({
    name: NAME,
    adapter: BullAdapter,
});
export const PROVIDER = FetchRateConsumer;