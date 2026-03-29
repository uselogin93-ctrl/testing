"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/feed",     icon: "🏠", label: "Feed" },
  { href: "/explore",  icon: "🔍", label: "Explore" },
  { href: "/messages", icon: "💬", label: "Messages" },
  { href: "/discover", icon: "🤖", label: "Discover AI" },
  { href: "/profile",  icon: "👤", label: "Profile" },
];

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{
        width: "220px",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "1.5rem 0.75rem",
        position: "sticky",
        top: 0,
        height: "100vh",
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ marginBottom: "2rem", padding: "0 0.75rem" }}>
          <span style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
            <span style={{ color: "var(--brand)" }}>Social</span>
            <span style={{ color: "var(--ai)" }}>AI</span>
          </span>
        </div>

        {/* Nav links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.625rem 0.75rem",
                  borderRadius: "8px",
                  color: active ? "#fff" : "var(--text-muted)",
                  background: active ? "var(--brand)" : "transparent",
                  textDecoration: "none",
                  fontWeight: active ? 700 : 500,
                  fontSize: "0.9rem",
                  transition: "all 0.15s",
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User at bottom */}
        <div style={{ marginTop: "auto", padding: "0.75rem", display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <UserButton afterSignOutUrl="/" />
          {user && (
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              @{user.username || user.firstName || "user"}
            </span>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, maxWidth: "680px", margin: "0 auto", padding: "1.5rem", width: "100%" }}>
        {children}
      </main>
    </div>
  );
}
