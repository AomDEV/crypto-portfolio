export type UseAssetOptions = {
    page?: number;
    limit?: number;
    callOnMount?: boolean;
};
export type Asset = {
    id: string,
    name: string,
    slug: string,
    symbol: string,
    decimals: 18,
    icon_id: string | null,
    deleted_at: Date | null,
    created_at: Date,
    updated_at: Date,
    quote: {
        id: string,
        asset_id: string,
        price_usd: number,
        price_thb: number,
        deleted_at: Date | null,
        created_at: Date,
        updated_at: Date
    }
};