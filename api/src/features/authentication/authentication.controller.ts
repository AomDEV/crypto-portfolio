import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginDTO } from "./dto/login.dto";
import { LoginUsecase } from "./usecases/login.usecase";
import { RegisterDTO } from "./dto/register.dto";
import { RegisterUsecase } from "./usecases/register.usecase";
import { Guest } from "@/common/decorators/guest";

@Controller('authentication')
@ApiTags('Authentication')
export class AuthenticationController {
    constructor (
        private readonly loginUsecase: LoginUsecase,
        private readonly registerUsecase: RegisterUsecase,
    ) {}
    
    @Post('login')
    @Guest()
    @ApiOperation({ summary: 'Login' })
    @ApiBody({ type: LoginDTO })
    async login (
        @Body() body: LoginDTO
    ) {
        return this.loginUsecase.execute({ body });
    }

    @Post('register')
    @Guest()
    @ApiOperation({ summary: 'Register' })
    @ApiBody({ type: RegisterDTO })
    async register (
        @Body() body: RegisterDTO
    ) {
        return this.registerUsecase.execute({ body });
    }
}