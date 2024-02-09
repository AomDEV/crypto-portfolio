import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@/common/shared/prisma';
import { JwtPayload } from '@/common/types/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET
		});
	}

	async validate(payload: JwtPayload) {
		const userId = payload.user_id;
		if (!userId) return null;

		return prisma.account.findUniqueOrThrow({
			where: {
				id: userId,
				deleted_at: null
			},
		}).catch(() => {
			throw new NotFoundException('User not found');
		});
	}
}