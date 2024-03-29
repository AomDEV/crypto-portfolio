import { PrismaClient, Prisma } from '@prisma/client';
import axios from "axios"

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export type PrismaModel = PrismaClient[Uncapitalize<Prisma.ModelName>];
export class Seed {
    private $transactions: Prisma.PrismaPromise<any>[] = [];

    constructor (
        private readonly prisma: PrismaClient
    ) {}

    parseJson(array: Array<{[key: string]: any}>) {
        return array.map((item) => {
            for (const key of Object.keys(item)) {
                if(/[0-9]n/.test(item[key])) item[key] = BigInt(item[key].replace('n', ''));
            }
            return item;
        });
    }

    async setup (
        model: PrismaModel,
        execution: (prisma: PrismaModel) => Prisma.PrismaPromise<any> | Array<Prisma.PrismaPromise<any>>
    ) {
        const count = await (model as unknown as any).count({});
        if(count > 0) return null;
        return this.$transactions.push(...[execution(model)].flat());
    }

    execute () {
        console.log(`Seeding ${this.$transactions.length} models...`);
        return this.prisma.$transaction(this.$transactions);
    }
}
export function cmc () {
    const apiUrl = String(process.env.CMC_API_URL);
    return axios.create({
        baseURL: apiUrl,
        headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
        }
    });
}