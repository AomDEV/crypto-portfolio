import { useContext, useEffect, useState } from "react";
import { UseQuoteOptions } from "./types";
import { AssetQuote } from "@/types/schema";
import { SseContext } from "@/context/sse";

export const EVENT_NAME = 'quote';
export function useQuote ({
    assetId,
    defaultQuote = null,
    callOnMount = true,
}: UseQuoteOptions) {
    const [quote, setQuote] = useState<AssetQuote | null>(defaultQuote);
    const { subscribe, unsubscribe } = useContext(SseContext);

    useEffect(() => {
        if (!callOnMount) return;
        subscribe(EVENT_NAME, (_message: AssetQuote) => {
            if (_message.asset_id !== assetId) return;
            setQuote(_message);
        });
        return () => unsubscribe(EVENT_NAME);
    }, [assetId, subscribe, unsubscribe]);
    useEffect(() => {
        if (!defaultQuote) return;
        setQuote(defaultQuote ?? null);
    }, [defaultQuote])

    return { quote };
}