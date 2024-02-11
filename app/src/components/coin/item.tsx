import Link from "next/link";
import CoinIcon from "./icon";
import { CoinItemProps } from "./types";
import { formatUnits } from "ethers"
import { useBalance } from "@/hooks/balance";
import { LoadingText } from "../loading";
import { useQuote } from "@/hooks/quote";
import { useMemo } from "react";

export default function CoinItem ({
    assetId,
    iconId,
    symbol,
    name,
    quote,
    showBalance = false,
    decimals = 18,
    currency = 'THB'
}: CoinItemProps) {
    const { quote: _quote } = useQuote({
        assetId,
        defaultQuote: quote
    });
    const { data, isLoading } = useBalance({
        assetId,
        callOnMount: showBalance
    });
    const coinBalance = useMemo(() => Number(data ? formatUnits(data.balance, decimals) : "0"), [data])

    return (
        <Link
            href={`/asset/${assetId}`}
            passHref
            title={name}
        >
            <div
                className={[
                    "border",
                    "rounded-lg",
                    "p-2",
                    "flex",
                    "gap-4",
                    "items-center",
                    "bg-white",
                    "hover:bg-slate-100",
                    "duration-250",
                    "transition-colors",
                ].join(" ")}
            >
                <CoinIcon iconId={iconId} symbol={symbol} width={32} height={32} />
                <div className="flex gap-2 items-center">
                    <h2 className="font-bold">{name}</h2>
                    <small>{symbol}</small>
                </div>
                <div className="flex-1 text-right">
                    {showBalance && <div className="flex justify-end gap-1 items-center">
                        <div className="italic text-xs text-slate-500">~{(coinBalance * (quote?.price_thb ?? 0)).toLocaleString(undefined, {minimumFractionDigits: 2})} THB</div>
                        <div className="font-bold">
                            {(() => {
                                if (isLoading) return <LoadingText />; 
                                const formattedBalance = coinBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
                                return [formattedBalance, symbol].join(' ');
                            })()}
                        </div>
                    </div>}
                    <div className="italic text-sm text-slate-500 flex gap-1 justify-end">
                        {(() => {
                            const className = (() => {
                                if (!quote || quote?.percent_change === 0) return 'text-slate-500';
                                return quote?.percent_change > 0 ? 'text-green-500' : 'text-red-500';
                            })();
                            const fragments = [
                                (() => {
                                    if (!quote || quote?.percent_change === 0) return null;
                                    return quote?.percent_change > 0 ? '+' : '';
                                })(),
                                quote?.percent_change.toFixed(2) ?? '0.00',
                                '%'
                            ];
                            return <small className={["font-bold", className].join(" ")}>{fragments.join('')}</small>;
                        })()}
                        {(() => {
                            const formattedPrice = (_quote?.price_thb ?? 0).toLocaleString(undefined, {minimumFractionDigits: 2});
                            return [formattedPrice, currency].join(' ');
                        })()}
                    </div>
                </div>
            </div>
        </Link>
    );
}