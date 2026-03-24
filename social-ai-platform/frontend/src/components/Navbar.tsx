"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const NAV = [
  { href: "/", label: "🏠 Feed" },
  { href: "/explore", label: "🔭 Explore" },
  { href: "/messages", label: "💬 Messages" },
  { href: "/profile", label: "👤 Profile" },
];

export default function Navbar() {
  const path = usePathname();
  return (
    <nav className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
      <Link href="/" className="font-black text-lg tracking-tight text-white">
        ✦ SocialAI
      </Link>
      <div className="flex items-center gap-1">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`text-sm px-3 py-1.5 rounded-lg transition font-medium
              ${path === n.href
                ? "bg-[var(--accent)] text-white"
                : "text-gray-400 hover:text-white hover:bg-[var(--bg)]"}`}
          >
            {n.label}
          </Link>
        ))}
      </div>
      <UserButton afterSignOutUrl="/sign-in" />
    </nav>
  );
}
