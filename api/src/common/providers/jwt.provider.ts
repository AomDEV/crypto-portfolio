import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

export const CONFIG: JwtModuleOptions = {
    secret: process.env.JWT_ACCESS_SECRET,
};
export const MODULE = JwtModule.register(CONFIG);