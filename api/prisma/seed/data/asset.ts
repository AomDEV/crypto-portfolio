import axios from "axios"

export default async function account () {
    const apiUrl = String(process.env.CMC_API_URL);
    const api = axios.create({
        baseURL: apiUrl,
        headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
        }
    });
    const response = await api.get(`/v1/cryptocurrency/listings/latest`, {
        params: {
            start: 1,
            limit: 100,
            convert: 'THB'
        }
    });
    const { data } = response.data;
    return (data as Array<{[key: string]: any}>).map(({
        name,
        symbol
    }) => ({
        name: String(name),
        symbol: String(symbol),
        decimals: 18,
    }))
}