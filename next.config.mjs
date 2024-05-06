import { readFileSync } from 'fs';

const packageJSON = JSON.parse(
  readFileSync('./package.json', {
    encoding: 'utf-8',
  }),
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    version: packageJSON.version,
  },
};

export default nextConfig;
