import Link from "next/link";
import CoinIcon from "./icon";
import { CoinItemProps } from "./types";
import { formatUnits } from "ethers"
import { useBalance } from "@/hooks/balance";
import { LoadingText } from "../loading";

export default function CoinItem ({
    assetId,
    iconId,
    symbol,
    name,
    price,
    showBalance = false,
    decimals = 18,
    currency = 'THB'
}: CoinItemProps) {
    const { data, isLoading } = useBalance({
        assetId,
        callOnMount: showBalance
    });

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
                    {showBalance && <div className="font-bold">
                        {(() => {
                            if (isLoading) return <LoadingText />; 
                            const formattedBalance = data ? formatUnits(data.balance, decimals) : 0;
                            return [formattedBalance, currency].join(' ');
                        })()}
                    </div>}
                    <div className="italic text-sm">
                        {(() => {
                            const formattedPrice = (price).toLocaleString(undefined, {minimumFractionDigits: 2});
                            return [formattedPrice, currency].join(' ');
                        })()}
                    </div>
                </div>
            </div>
        </Link>
    );
}