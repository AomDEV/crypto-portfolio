import { api } from "@/lib/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UsePositionOptions } from "./types";
import { AssetPosition } from "@/types/schema";

export function usePosition (options: UsePositionOptions) {
    options = Object.assign({
        callOnMount: true,
    }, options);
    const { assetId, positionId, callOnMount } = options;
    
    const [data, setData] = useState<AssetPosition | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const noData = useMemo(() => !isLoading && !Boolean(data), [data, isLoading]);

    const fetch = useCallback(async () => {
        if (!assetId) return;
        setIsLoading(true)
        return api().get(`/v1/asset/${assetId}/position/${positionId}`).then((response) => {
            setData(response.data);
        }).catch(() => {
            setData(null);
        }).finally(() => {
            setIsLoading(false);
        })
    }, [assetId, positionId]);
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