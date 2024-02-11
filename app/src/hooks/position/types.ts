export type UsePositionsOptions = {
    assetId: string;
    page?: number,
    limit?: number,
    callOnMount?: boolean;
};
export type UsePositionOptions = {
    assetId: string;
    positionId: string;
    callOnMount?: boolean;
};