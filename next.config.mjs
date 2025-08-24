import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bxwwmeagqizeikztaczl.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  // 번들 최적화
  experimental: {
    optimizePackageImports: ['@uiw/react-md-editor', '@uiw/react-markdown-preview'],
  },
  // 청킹 최적화
  webpack: (config, { dev }) => {
    if (!dev) {
      // 프로덕션에서만 적용
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          markdown: {
            test: /[\\/]node_modules[\\/](@uiw|rehype|remark).*[\\/]/,
            name: 'markdown',
            chunks: 'all',
          },
          ui: {
            test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
            name: 'ui-components',
            chunks: 'all',
          },
        },
      }
    }
    return config
  },
};

export default withBundleAnalyzer(nextConfig);