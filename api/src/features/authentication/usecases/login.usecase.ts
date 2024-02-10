import { BaseUsecase } from "@/common/shared/usecase";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { LoginDTO } from "../dto/login.dto";
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { JwtService } from "@nestjs/jwt";

type LoginUsecaseProps = {
    body: LoginDTO
};
type LoginUsecaseResponse = {
    user_id: string,
    access_token: string,
    expires_in: Date,
};

@Injectable()
export class LoginUsecase extends BaseUsecase<Promise<LoginUsecaseResponse>> { 
    constructor (
        private readonly jwtService: JwtService
    ) {
        super();
    }
    
    async execute ({
        body,
    }: LoginUsecaseProps) {
        const { username, password } = body;
        const account = await this.prismaService.account.findFirst({
            where: {
                username,
                deleted_at: null,
            },
        });
        if (!account) throw new ForbiddenException('Invalid username or password');

        const isPasswordValid = await bcrypt.compare(password, account.password);
        if (!isPasswordValid) throw new ForbiddenException('Invalid username or password');

        const user_id = account.id;
        const expires_in = moment().add(3, 'hours').toDate();
        const access_token = await this.jwtService.signAsync({
            user_id: account.id,
        }, {
            expiresIn: '3h',
            secret: process.env.JWT_SECRET,
        });
        return { user_id, access_token, expires_in }
    }
}