import { BullBoardModule, BullBoardModuleOptions } from "@bull-board/nestjs";
import { ExpressAdapter } from "@bull-board/express";

export const getConfig = (): BullBoardModuleOptions => ({
    route: '/queues',
    adapter: ExpressAdapter,
});
export const getModule = () => {
    const config = getConfig();
    return BullBoardModule.forRoot(config);
}

export const CONFIG: BullBoardModuleOptions = getConfig();
export const MODULE = getModule();