import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  /** السماح بالوصول من الهاتف عبر IP الشبكة المحلية (بدونها: صفحة بيضاء على الجوال) */
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.1.37",
    "192.168.1.37:3000",
    "192.168.8.106",
    "192.168.8.106:3000",
    "192.168.1.169",
    "192.168.1.169:3000",
    "172.20.10.2",
    "172.20.10.3",
    "172.20.10.8",
    "172.20.10.8:3000",
    "172.21.0.1",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
