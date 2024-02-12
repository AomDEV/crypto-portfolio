import { api } from "@/lib/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UseAssetOptions } from "./types";
import { Asset } from "@/types/schema";

export function useAsset (options: UseAssetOptions) {
    options = Object.assign({
        callOnMount: true,
    }, options);
    const { assetId, callOnMount } = options;
    
    const [data, setData] = useState<Asset | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const noData = useMemo(() => !isLoading && !Boolean(data), [data, isLoading]);

    const fetch = useCallback(async () => {
        if (!assetId) return;
        setIsLoading(true)
        return api().get(`/v1/asset/${assetId}`).then((response) => {
            setData(response.data);
        }).catch(() => {
            setData(null);
        }).finally(() => {
            setIsLoading(false);
        })
    }, [assetId]);
    useEffect(() => {
        if (callOnMount) fetch();
    }, [callOnMount, fetch]);

    return {
        data,
        isLoading,
        noData,
        fetch,
    };
}