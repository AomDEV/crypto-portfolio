/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: [
            's2.coinmarketcap.com' // CoinMarketCap
        ]
    }
};

export default nextConfig;
