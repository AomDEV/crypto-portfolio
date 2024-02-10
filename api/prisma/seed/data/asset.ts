import { cmc } from "../client";


export default async function account () {
    const response = await cmc().get(`/v1/cryptocurrency/listings/latest`, {
        params: {
            start: 1,
            limit: 100,
            convert: 'THB'
        }
    });
    const { data } = response.data;
    return (data as Array<{[key: string]: any}>).map(({
        name,
        symbol,
        slug
    }) => ({
        name: String(name),
        symbol: String(symbol),
        slug: String(slug),
        decimals: 18,
    }))
}