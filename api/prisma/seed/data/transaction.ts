import { Prisma } from "@prisma/client";
import BigNumber from "bignumber.js";

export default async function transaction (accounts: {id: string}[], assets: {id: string, decimals: number}[]) {
    return assets.map(asset => accounts.map((account) => ({
        asset_id: asset.id,
        user_id: account.id,
        type: 'BONUS',
        description: null,
        in: new Prisma.Decimal(BigNumber(100).multipliedBy(BigNumber(10).pow(asset.decimals)).toString()),
        out: 0,
    }))).flat();
}