import { api } from "@/lib/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AssetBalance, UseBalanceOptions } from "./types";

export function useBalance ({
    assetId,
    callOnMount = true,
}: UseBalanceOptions) {
    const [data, setData] = useState<AssetBalance | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const noData = useMemo(() => !isLoading && !Boolean(data), [data, isLoading]);

    const fetch = useCallback(async () => {
        setIsLoading(true)
        return api().get(`/v1/asset/${assetId}/balance`).then((response) => {
            setData(response.data);
        }).catch(() => {
            setData(null);
        }).finally(() => {
            setIsLoading(false);
        })
    }, [assetId]);
    useEffect(() => {
        if (callOnMount) fetch();
    }, [assetId]);

    return {
        data,
        isLoading,
        noData,
        fetch,
    };
}