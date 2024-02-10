export type CoinIconProps = {
    iconId: string | null;
    symbol: string;
    width?: number;
    height?: number;
};
export type CoinItemProps = {
    assetId: string;
    name: string;
    symbol: string;
    iconId: string | null;
    price: number;
    decimals: number;
    currency?: string;
    showBalance?: boolean;
};