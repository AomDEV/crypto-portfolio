import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginUsecase } from "./usecases/login.usecase";
import { AuthenticationController } from "./authentication.controller";
import { RegisterUsecase } from "./usecases/register.usecase";

@Module({
    imports: [],
    controllers: [AuthenticationController],
    providers: [
        JwtService,

        LoginUsecase,
        RegisterUsecase,
    ],
})
export class AuthenticationModule {}