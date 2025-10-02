/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  // 🔑 garante IDs únicos no build (evita cache maluco em Netlify/Vercel)
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },

  // 🔑 standalone = recomendado para Netlify/Vercel
  output: "standalone",
};

export default nextConfig;
