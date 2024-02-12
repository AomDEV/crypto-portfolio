"use client";
import CoinItem from "@/components/coin/item";
import { LoadingText, NoDataText } from "@/components/loading";
import Paginator from "@/components/paginator";
import usePaginator from "@/components/paginator/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssets } from "@/hooks/asset/get-all";
import { Fragment } from "react";

const LIMIT = 10;
export default function Page () {
    const {fetch, data, meta, isLoading, noData} = useAssets({
        page: 1,
        limit: LIMIT,
        callOnMount: false
    });
    const { currentPage } = usePaginator({fetch})

    if (isLoading) return new Array(10).fill(null).map((_, index) => (
        <div key={index} className="flex my-2 items-center gap-2 h-[62px] border rounded-lg p-2">
            <div>
                <Skeleton className="rounded-full h-[32px] w-[32px]" />
            </div>
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-32 h-8" />
        </div>
    ));
    if (noData) return <NoDataText />;
    return (
        <Fragment>
            <div className="flex flex-col gap-2 mb-2">
                {data.map((coin, index) => (
                    <div key={index}>
                        <CoinItem
                            assetId={coin.id}
                            iconId={coin.icon_id}
                            symbol={coin.symbol}
                            name={coin.name}
                            quote={coin.quote}
                            decimals={coin.decimals}
                            showBalance
                        />
                    </div>
                ))}
            </div>
            {meta && <Paginator
                totalItems={meta.totalCount}
                totalPages={meta.pageCount}
                perPage={LIMIT}
                currentPage={currentPage}
            />}
        </Fragment>
    );
}