import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginDTO } from "./dto/login.dto";
import { LoginUsecase } from "./usecases/login.usecase";

@Controller('authentication')
@ApiTags('Authentication')
export class AuthenticationController {
    constructor (
        private readonly loginUsecase: LoginUsecase,
    ) {}
    
    @Post('login')
    @ApiOperation({ summary: 'Login' })
    @ApiBody({ type: LoginDTO })
    async login (
        @Body() body: LoginDTO
    ) {
        return this.loginUsecase.execute({ body });
    }
}