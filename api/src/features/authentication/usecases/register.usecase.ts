import { BaseUsecase } from "@/common/shared/usecase";
import { Account } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from "../dto/register.dto";
import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { isDevelopment } from "@/common/helpers/env";
import { TYPES } from "@/common/constants/transaction";

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

        return this.prismaService.$transaction(async (tx) => {
            const account = await tx.account.create({
                data: {
                    first_name,
                    last_name,
                    username,
                    password: bcrypt.hashSync(password, 10),
                    email,
                    verified_at: isDevelopment() ? new Date : null,
                },
            });

            if (isDevelopment()) {
                const assets = await tx.asset.findMany({
                    where: {
                        deleted_at: null,
                    },
                    take: 10,
                    orderBy: {
                        created_at: "desc"
                    }
                });
                const transactions = await tx.transaction.createMany({
                    data: assets.map(asset => ({
                        asset_id: asset.id,
                        user_id: account.id,
                        type: TYPES.BONUS,
                        description: 'FOR DEVELOPMENT PURPOSES',
                        in: 10 * (10**asset.decimals),
                        out: 0,
                    }))
                });
                if (transactions.count !== assets.length) throw new ForbiddenException('Failed to create transactions');
            }

            return account;
        })
    }
}