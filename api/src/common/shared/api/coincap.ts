// v2/assets/ethereum
import axios from 'axios';

export default function coincap() {
    const apiUrl = String(process.env.COINCAP_API_URL);
    return axios.create({
        baseURL: apiUrl,
    });
}