/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["api.dicebear.com", "img.clerk.com", "images.clerk.dev"],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://testing-qox1.onrender.com",
  },
};
module.exports = nextConfig;
