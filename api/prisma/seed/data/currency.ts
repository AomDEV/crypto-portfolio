export const THB_UUID = 'a00af929-b2ae-470c-a2cf-9af755f81a3f';
export const USD_UUID = 'a19fe545-59b8-476a-825a-bb7d954590cf';
export default async function currency () {
    return [
        {
            id: THB_UUID,
            symbol: 'THB',
        },
        {
            id: USD_UUID,
            symbol: 'USD',
        },
    ];
}