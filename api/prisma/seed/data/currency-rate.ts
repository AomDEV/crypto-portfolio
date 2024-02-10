import { THB_UUID, USD_UUID } from "./currency";

export default async function currencyRate () {
    return [
        {
            currency_id: THB_UUID,
            symbol: 'THB',
            rate: 1,
        },
        {
            currency_id: USD_UUID,
            symbol: 'THB',
            rate: 30,
        }
    ];
}