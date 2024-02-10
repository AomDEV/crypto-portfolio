import CoinIcon from "./icon";
import { CoinItemProps } from "./types";
import { formatUnits } from "ethers"

export default function CoinItem ({
    icon_id,
    symbol,
    name,
    slug,
    price,
    balance,
    decimals = 18,
    currency = 'THB'
}: CoinItemProps) {
    return (
        <div className="border rounded-lg p-2 flex gap-4 items-center">
            <CoinIcon icon_id={icon_id} symbol={symbol} width={32} height={32} />
            <div className="flex gap-2 items-center">
                <h2 className="font-bold">{name}</h2>
                <small>{symbol}</small>
            </div>
            <div className="flex-1 text-right">
                {balance && <div className="font-bold">
                    {(() => {
                        const formattedBalance = formatUnits(balance, decimals);
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
    );
}