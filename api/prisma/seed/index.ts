import { Seed, prisma } from "./client";

import account from "./data/account";
import asset from "./data/asset";

async function main() {
    const seed = new Seed(prisma);

    const _accounts = await account();
    await seed.setup(prisma.account, (tx: typeof prisma.account) => tx.createMany({ data: _accounts}));

    const _assets = await asset();
    await seed.setup(prisma.asset, (tx: typeof prisma.asset) => tx.createMany({ data: _assets}));

    await seed.execute();
}
main().catch(e => {
    console.error(e)
    process.exit(1)
}).finally(async () => {
    await prisma.$disconnect()
})