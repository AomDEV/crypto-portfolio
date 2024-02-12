import { BullModule } from "@nestjs/bull";
import { BullBoardModule } from "@bull-board/nestjs";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { DefaultConsumer } from "./processor";
import { join } from "path";

export const NAME = 'default';
export const MODULE = BullModule.registerQueue({
    name: NAME,
    processors: [join(__dirname, 'processor.js')]
});
export const FEATURE = BullBoardModule.forFeature({
    name: NAME,
    adapter: BullAdapter,
});
export const PROVIDER = DefaultConsumer;