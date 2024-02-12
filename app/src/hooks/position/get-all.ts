import { useCallback, useEffect, useMemo, useState } from "react";
import { UsePositionsOptions } from "./types";
import { AssetPosition } from "@/types/schema";
import { PaginationMeta } from "@/types/pagination";
import { api } from "@/lib/api";

export function usePositions (options: UsePositionsOptions) {
    options = Object.assign({
        page: 1,
        limit: 10,
        callOnMount: true,
    }, options);
    const { assetId, page: _page, limit, callOnMount } = options;

    const [data, setData] = useState<Array<AssetPosition>>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const noData = useMemo(() => !isLoading && data.length === 0, [data, isLoading]);

    const fetch = useCallback(async (page: number) => {
        setIsLoading(true)
        setMeta(null);
        return api().get(`/v1/asset/${assetId}/position`, {
            params: {
                page,
                limit,
            }
        }).then((response) => {
            const { data, meta } = response.data;
            setData(data);
            setMeta(meta);
        }).catch(() => {
            setData([]);
            setMeta(null);
        }).finally(() => {
            setIsLoading(false);
        })
    }, [assetId, limit]);
    useEffect(() => {
        if (callOnMount) fetch(_page ?? 1);
    }, [callOnMount, _page, fetch]);

    return {
        data,
        meta,
        isLoading,
        noData,
        fetch,
    };
}