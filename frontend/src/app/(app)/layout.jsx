import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function AppLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          padding: "1.5rem 1rem",
          position: "sticky",
          top: 0,
          height: "100vh",
          gap: "0.5rem",
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: "2rem", padding: "0 0.5rem" }}>
          <span
            style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            <span style={{ color: "var(--brand)" }}>Social</span>
            <span style={{ color: "var(--ai)" }}>AI</span>
          </span>
        </div>

        {/* Nav links */}
        {[
          { href: "/feed", icon: "🏠", label: "Feed" },
          { href: "/explore", icon: "🔍", label: "Explore" },
          { href: "/messages", icon: "💬", label: "Messages" },
          { href: "/discover", icon: "🤖", label: "Discover AI" },
          { href: "/profile", icon: "👤", label: "Profile" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.625rem 0.75rem",
              borderRadius: "8px",
              color: "var(--text)",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: "0.95rem",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface2)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}

        {/* User button at bottom */}
        <div style={{ marginTop: "auto", padding: "0 0.25rem" }}>
          <UserButton afterSignOutUrl="/" />
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          maxWidth: "680px",
          margin: "0 auto",
          padding: "1.5rem",
          width: "100%",
        }}
      >
        {children}
      </main>
    </div>
  );
}
