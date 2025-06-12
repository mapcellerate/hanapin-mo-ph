/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001'],
    },
  },
  webpack: (config, { isServer }) => {
    // Add a rule to handle the undici module
    config.module.rules.push({
      test: /node_modules\/undici\/lib\/web\/fetch\/util\.js$/,
      loader: 'string-replace-loader',
      options: {
        search: '!(#target in this)',
        replace: '!("target" in this)',
      },
    });

    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googleapis.com *.google.com; style-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' data: blob: *.googleapis.com *.gstatic.com *.ggpht.com; font-src 'self' data: *.gstatic.com; connect-src 'self' *.googleapis.com *.gstatic.com; frame-src 'self' *.google.com; worker-src 'self' blob:;"
          }
        ]
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleapis.com'
      },
      {
        protocol: 'https',
        hostname: '**.gstatic.com'
      },
      {
        protocol: 'https',
        hostname: '**.ggpht.com'
      }
    ],
    unoptimized: true,
  },
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/hanapin-mo-ph' : '',
}

module.exports = nextConfig 