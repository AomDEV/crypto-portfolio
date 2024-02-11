import { cmc } from "../client";
import { v4 as uuidv4 } from 'uuid';

export default async function asset () {
    const response = await cmc().get(`/v1/cryptocurrency/listings/latest`, {
        params: {
            start: 1,
            limit: 100,
            convert: 'THB'
        }
    });
    const { data } = response.data;
    return (data as Array<{[key: string]: any}>).map(({
        id,
        name,
        symbol,
        slug,
    }) => ({
        id: uuidv4(),
        name: String(name),
        symbol: String(symbol),
        slug: String(slug),
        decimals: 18,
        icon_id: String(id),
    }))
}