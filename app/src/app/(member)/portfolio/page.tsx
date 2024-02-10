"use client";
import CoinIcon from "@/components/coin/icon";
import CoinItem from "@/components/coin/item";
import { LoadingText, NoDataText } from "@/components/loading";
import Paginator from "@/components/paginator";
import usePaginator from "@/components/paginator/hooks";
import { useAsset } from "@/hooks/asset";
import { Fragment } from "react";

const LIMIT = 10;
export default function Page () {
    const {fetch, data, meta, isLoading, noData} = useAsset({
        page: 1,
        limit: LIMIT,
        callOnMount: false
    });
    const { currentPage } = usePaginator({fetch})

    if (isLoading) return <LoadingText />;
    if (noData) return <NoDataText />;
    return (
        <Fragment>
            <div className="flex flex-col gap-2">
                {data.map((coin, index) => (
                    <div key={index}>
                        <CoinItem
                            assetId={coin.id}
                            iconId={coin.icon_id}
                            symbol={coin.symbol}
                            name={coin.name}
                            price={coin.quote?.price_thb ?? 0}
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