import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginUsecase } from "./usecases/login.usecase";
import { AuthenticationController } from "./authentication.controller";

@Module({
    imports: [],
    controllers: [AuthenticationController],
    providers: [
        JwtService,

        LoginUsecase,
    ],
})
export class AuthenticationModule {}