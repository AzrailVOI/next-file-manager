import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    sassOptions: {
        silenceDeprecations: ['legacy-js-upload'],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '100mb'
        }
    }
};

export default nextConfig;
