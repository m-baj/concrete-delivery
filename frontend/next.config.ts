const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/public/favicon.ico',
        permanent: true,
      },
    ];
  },

  images: {
    domains: ['example.com'],
  },

};

export default nextConfig;
