import { api } from "@/lib/api";
import { PaginationMeta } from "@/types/pagination";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Asset, UseAssetOptions } from "./types";

export function useAsset (options: UseAssetOptions = {}) {
    options = Object.assign({
        page: 1,
        limit: 10,
        callOnMount: true,
    }, options);
    const { page: _page, limit, callOnMount } = options;
    
    const [data, setData] = useState<Asset[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const noData = useMemo(() => !isLoading && data.length === 0, [data, isLoading]);

    const fetch = useCallback(async (page: number) => {
        setIsLoading(true)
        setMeta(null);
        return api().get(`/v1/asset`, {
            params: {
                page,
                limit,
            }
        }).then((response) => {
            const { data, meta } = response.data;
            setData(data);
            setMeta(meta);
        }).finally(() => {
            setIsLoading(false);
        })
    }, [_page, limit]);
    useEffect(() => {
        if (callOnMount) fetch(_page ?? 1);
    }, [_page, limit]);

    return {
        data,
        meta,
        isLoading,
        noData,
        fetch,
    };
}