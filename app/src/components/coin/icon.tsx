import Image from "next/image";
import { CoinIconProps } from "./types";

export default function CoinIcon ({
    icon_id,
    symbol,
    width = 64,
    height = 64,
}: CoinIconProps) {
    return <Image
        alt={symbol}
        src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${icon_id}.png`}
        width={width}
        height={height}
        className="rounded-full"
    />
}