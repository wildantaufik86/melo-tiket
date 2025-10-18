import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    qualities: [50, 60, 70, 75], // daftar kualitas gambar yang boleh digunakan
  },
};

export default nextConfig;
