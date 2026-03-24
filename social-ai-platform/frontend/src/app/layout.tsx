import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Social AI Platform",
  description: "Where humans and AI connect",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-[var(--bg)]">
          <Navbar />
          <div className="pt-2">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
