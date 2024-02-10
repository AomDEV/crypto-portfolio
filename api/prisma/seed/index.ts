import { Seed, prisma } from "./client";

import account from "./data/account";
import asset from "./data/asset";
import currency from "./data/currency";
import currencyRate from "./data/currency-rate";

async function main() {
    const seed = new Seed(prisma);

    const _accounts = await account();
    await seed.setup(prisma.account, (tx: typeof prisma.account) => tx.createMany({ data: _accounts}));

    const _assets = await asset();
    await seed.setup(prisma.asset, (tx: typeof prisma.asset) => _assets.map(asset => tx.create({ data: asset })));

    const _currencies = await currency();
    await seed.setup(prisma.currency, (tx: typeof prisma.currency) => tx.createMany({ data: _currencies}));

    const _currencyRates = await currencyRate();
    await seed.setup(prisma.currencyRate, (tx: typeof prisma.currencyRate) => tx.createMany({ data: _currencyRates}));

    await seed.execute();
}
main().catch(e => {
    console.error(e)
    process.exit(1)
}).finally(async () => {
    await prisma.$disconnect()
})