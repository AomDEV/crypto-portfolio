import { api } from "@/lib/api";
import { PaginationMeta } from "@/types/pagination";
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
            const { data } = response.data;
            setData(data);
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