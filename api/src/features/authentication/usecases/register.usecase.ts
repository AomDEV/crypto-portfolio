import { BaseUsecase } from "@/common/shared/usecase";
import { Account } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from "../dto/register.dto";
import { BadRequestException } from "@nestjs/common";
import { isDevelopment } from "@/common/helpers/env";

type RegisterUsecaseProps = {
    body: RegisterDTO
};

export class RegisterUsecase extends BaseUsecase<Promise<Account>> {
    constructor () {
        super();
    }

    async execute({
        body
    }: RegisterUsecaseProps): Promise<Account> {
        const { first_name, last_name, username, password, confirm_password, email } = body;
        if (password !== confirm_password) throw new BadRequestException('Password and confirm password do not match');

        // check username and email is unique
        const isUsernameUnique = await this.prismaService.account.findFirst({
            where: {
                username,
            }
        });
        if (isUsernameUnique) throw new BadRequestException('Username is already taken');

        if (email) {
            const isEmailUnique = await this.prismaService.account.findFirst({
                where: {
                    email,
                }
            });
            if (isEmailUnique) throw new BadRequestException('Email is already taken');
        }

        return this.prismaService.account.create({
            data: {
                first_name,
                last_name,
                username,
                password: bcrypt.hashSync(password, 10),
                email,
                verified_at: isDevelopment() ? new Date : null,
            },
        });
    }
}