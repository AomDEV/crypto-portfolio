import { BullModule, BullRootModuleOptions } from "@nestjs/bull";

export const getConfig = (): BullRootModuleOptions => ({
    redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
    },
});
export const getModule = () => {
    const config = getConfig();
    return BullModule.forRoot(config);
}

export const CONFIG = getConfig();
export const MODULE = getModule();