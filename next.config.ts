import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/GitchPage' : '',
  output: 'export',
  images: {
    unoptimized: true,
  },
  pageExtensions: ['ts', 'tsx', 'mdx', 'md', 'js', 'jsx'],
};

export default withMDX(nextConfig);
