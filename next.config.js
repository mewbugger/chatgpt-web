/** @type {import('next').NextConfig} */
const nextConfig = {
    target: 'server',
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });

        return config;
    },
    output: "standalone",
}

module.exports = nextConfig

