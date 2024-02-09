import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { GUEST } from '@/common/decorators/guest';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(private reflector: Reflector) {
        super();
    }

    override async canActivate(context: ExecutionContext) {
        const guest = this.reflector.get<boolean>(
            GUEST,
            context.getHandler(),
        );
        if (guest) return true;

        const canActivate = (super.canActivate(context) as Promise<boolean>).catch((e) => {
            throw new UnauthorizedException('Unauthorized');
        });
        const result = (await canActivate) as boolean;

        const req = this.getRequest(context);
        const isValidUser = req.user && typeof req.user === 'object' && Object.keys(req.user).length > 0;
        const user = isValidUser ? req.user : null;

        req.user = user;

        if (!result) throw new UnauthorizedException('Unauthorized');
        return true;
    }
}