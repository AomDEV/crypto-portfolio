import { v4 as uuidv4 } from 'uuid';

export const THB_UUID = 'a00af929-b2ae-470c-a2cf-9af755f81a3f';
export default async function currency () {
    return [
        {
            id: THB_UUID,
            symbol: 'THB',
        },
        {
            id: uuidv4(),
            symbol: 'USD',
        },
    ];
}