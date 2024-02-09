import axios from 'axios';

export function cmc () {
    const apiUrl = String(process.env.CMC_API_URL);
    return axios.create({
        baseURL: apiUrl,
        headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
        }
    });
}