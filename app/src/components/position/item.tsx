import CoinIcon from "@/components/coin/icon";
import { PositionItemProps } from "./types";
import moment from "moment";
import { formatUnits } from "ethers";
import { EPositionStatus } from "@/types/schema";
import { Button } from "../ui/button";

export default function PositionItem({
    asset: data,
    position,
    quote,
    onClose,
    loading
}: PositionItemProps) {
    return (
        <div className="border w-full rounded-lg p-2">
            <div className="flex gap-2 items-center">
                <div className="flex items-center gap-2">
                    <CoinIcon iconId={data.icon_id} symbol={data.symbol} width={16} height={16} />
                    <div className="font-bold">{data.name}</div>
                    <small>{data.symbol}</small>
                </div>
                <div className="text-sm text-muted-foreground flex-1 text-right">
                    {moment(position.created_at).format('DD-MM-YYYY HH:mm:ss')}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div>
                    <div className="flex gap-2 items-center text-muted-foreground text-sm">
                        <div className="w-20">Entry Price</div>
                        <div className="font-bold">{Number(position.entry_price).toLocaleString(undefined, { minimumFractionDigits: 2 })} THB</div>
                    </div>
                    <div className="flex gap-2 items-center text-muted-foreground text-sm">
                        <div className="w-20">Amount</div>
                        <div className="font-bold">{Number(formatUnits(position.amount, data.decimals)).toFixed(2)} {data.symbol}</div>
                    </div>
                </div>
                <div className={`text-right flex-1 ${Number(position.performance.percentage) > 0 ? 'text-green-700' : 'text-red-700'}`}>
                    <div className="font-bold text-lg">
                        {position.performance.percentage.toLocaleString(undefined, { minimumFractionDigits: 2 })}%
                    </div>
                    <div className="text-sm flex items-center gap-2 justify-end">
                        <small className="italic">
                            ~{(Number(formatUnits(position.performance.net_profit, data.decimals)) * Number(position.exit_price ?? quote?.price_thb.toString() ?? 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })} THB
                        </small>
                        <div>
                            {Number(formatUnits(position.performance.net_profit, data.decimals)).toFixed(2)} {data.symbol}
                        </div>
                    </div>
                </div>
            </div>
            {position.status === EPositionStatus.OPEN && (
                <div className="mt-2">
                    <Button disabled={loading} size={"sm"} onClick={() => onClose(position.id)}>
                        Close Position
                    </Button>
                </div>
            )}
        </div>
    );
}