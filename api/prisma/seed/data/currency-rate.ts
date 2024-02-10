import { THB_UUID } from "./currency";

export default async function currencyRate () {
    return [
        {
            currency_id: THB_UUID,
            symbol: 'THB',
            rate: 1,
        }
    ];
}