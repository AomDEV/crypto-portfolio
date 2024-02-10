export type CoinIconProps = {
    icon_id: string | null;
    symbol: string;
    width?: number;
    height?: number;
};
export type CoinItemProps = {
    name: string;
    symbol: string;
    icon_id: string | null;
    slug?: string;
    price: number;
    decimals: number;
    balance?: string;
    currency: string;
};