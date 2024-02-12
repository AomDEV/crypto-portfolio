import BigNumber from "bignumber.js";

export const getDecimalFactor = (decimals: number) => BigNumber(10).pow(decimals);
export function toBigNumber(value: string, decimals: number) {
    return BigNumber(value).multipliedBy(getDecimalFactor(decimals));
}
export function toReadable(value: string, decimals: number) {
    return BigNumber(value).div(getDecimalFactor(decimals))
}