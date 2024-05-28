/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    UDF_LOCAL: process.env.NEXT_UDF_URL,
  },
};

export default nextConfig;
