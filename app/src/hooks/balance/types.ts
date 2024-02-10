import { AssetQuote } from "@/types/schema";

export type UseBalanceOptions = {
    assetId: string;
    callOnMount?: boolean;
};
export type AssetBalance = {
    quote: AssetQuote;
    balance: string;
    fiat: number;
};