export default async function transaction (accounts: {id: string}[], assets: {id: string}[]) {
    return assets.map(asset => accounts.map((account) => ({
        asset_id: asset.id,
        user_id: account.id,
        type: 'BONUS',
        description: null,
        in: 100,
        out: 0,
    }))).flat();
}