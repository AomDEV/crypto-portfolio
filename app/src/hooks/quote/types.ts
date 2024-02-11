import { AssetQuote } from "@/types/schema";

export type UseQuoteOptions = {
    assetId: string;
    defaultQuote?: AssetQuote | null;
    callOnMount?: boolean;
};