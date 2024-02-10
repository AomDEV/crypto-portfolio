import axios from "axios";

export const api = (() => {
    const KEY = 'access_token';
    const _instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        withCredentials: false
    });
    // Add a request interceptor
    _instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem(KEY);
            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        },
        (error) => Promise.reject(error)
    );
    _instance.interceptors.response.use(
        (config) => {
            const hasToken = config.config.url?.includes('login') && config.status >= 200 && config.status < 300;
            if (hasToken) localStorage.setItem(KEY, config.data.access_token);
            return config;
        }
    )
    return _instance;
});