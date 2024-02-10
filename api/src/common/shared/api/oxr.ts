import axios from 'axios';

export default function oxr() {
    const apiUrl = String(process.env.OXR_API_URL);
    return axios.create({
        baseURL: apiUrl,
    });
}