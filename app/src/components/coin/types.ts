import { AssetQuote } from "@/types/schema";

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
    quote?: AssetQuote;
    decimals: number;
    currency?: string;
    showBalance?: boolean;
};