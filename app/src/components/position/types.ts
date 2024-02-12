import { Asset, AssetPosition, AssetQuote } from "@/types/schema";

export type PositionItemProps = {
    asset: Asset;
    position: AssetPosition;
    quote: AssetQuote | null;
    onClose: (positionId: string) => void;
    loading?: boolean;
};