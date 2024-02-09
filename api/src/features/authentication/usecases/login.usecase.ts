import { BaseUsecase } from "@/common/shared/usecase";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { LoginDTO } from "../dto/login.dto";
import { ZeroAddress, ethers } from "ethers";
import { prisma } from "@/common/shared/prisma";
import { JwtService } from "@nestjs/jwt";

type LoginUsecaseProps = {
    body: LoginDTO
};

@Injectable()
export class LoginUsecase extends BaseUsecase<Promise<any>> { 
    constructor (
        private readonly jwtService: JwtService
    ) {
        super();
    }
    
    async execute ({
        body,
    }: LoginUsecaseProps) {
        const { wallet_address, message, signature } = body;
        const recovered = ethers.recoverAddress(message, signature);

        if (recovered !== wallet_address) throw new ForbiddenException('Invalid signature');

        let account = await prisma.account.findUnique({
            where: {
                wallet_account: wallet_address,
                deleted_at: null,
            },
        });
        if (!account) account = await prisma.account.create({
            data: {
                wallet_account: wallet_address,
                created_at: new Date(),
                deleted_at: null,
            },
        });
        
        return this.jwtService.sign({
            user_id: account.id,
        }, {
            secret: process.env.JWT_SECRET,
        });
    }
}