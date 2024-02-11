export type AssetQuote = {
    id: string,
    asset_id: string,
    price_usd: number,
    volume_usd: number,
    price_thb: number,
    volume_thb: number,
    percent_change: number,
    deleted_at: Date | null,
    created_at: Date,
    updated_at: Date
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
    balance?: string,
    quote?: AssetQuote,
};

export enum EDirection {
    LONG,
    SHORT
}
export enum EPositionStatus {
    OPEN,
    CLOSE
}
export type AssetPosition = {
    id: string,
    asset_id: string,
    user_id: string,
    leverage: number,
    direction: EDirection,
    amount: string,
    entry_price: string,
    exit_price?: string,
    profit?: string
    status: EPositionStatus,
    open_tx_id: string,
    close_tx_id?: string,
    exited_at?: Date,
    deleted_at?: Date,
    created_at: Date,
    updated_at: Date,
};