import { Injectable, NotImplementedException } from "@nestjs/common";
import { paginate, prisma } from "@/common/shared/prisma";

@Injectable()
export class BaseUsecase<T> {
    constructor () {}
    
    get prismaService() {
        return prisma;
    }

    get pagination() {
        return paginate;
    }

    execute(...args: any[]): T {
        throw new NotImplementedException('Method not implemented');
    }
}