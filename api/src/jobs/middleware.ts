import { getBasicToken } from "@/common/helpers/passport";
import { NestRequest } from "@/common/types/nest";
import { NestMiddleware } from "@nestjs/common";
import { Response } from "express";

export function middleware(req: NestRequest, res: Response, next: Function) {
    const username = process.env.BULL_BOARD_USERNAME ?? "admin";
    const password = process.env.BULL_BOARD_PASSWORD ?? "admin";

    if (!username || !password) return next();

    const credentials = Buffer.from([username, password].join(':')).toString('base64');
    const token = getBasicToken(req);

    if (!token || token !== credentials) {
        res.setHeader(
            'WWW-Authenticate',
            'Basic realm="Bull Board", charset="UTF-8"',
        );
        return res.sendStatus(401);
    }
    return next();
}
export class Middleware implements NestMiddleware {
    use(req: NestRequest, res: Response, next: Function) {
        middleware(req, res, next);
    }
}