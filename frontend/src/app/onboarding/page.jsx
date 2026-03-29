"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api } from "../../lib/api";

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [status, setStatus] = useState("Setting up your account...");
  const [error, setError] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (!isLoaded || !user || ran.current) return;
    ran.current = true;

    const register = async () => {
      try {
        const username =
          user.username ||
          (user.firstName
            ? (user.firstName + (user.lastName || "")).toLowerCase().replace(/\s+/g, "")
            : null) ||
          `user_${user.id.slice(-6)}`;

        await api.registerUser({
          clerkId: user.id,
          username,
          email: user.primaryEmailAddress?.emailAddress || "",
          avatar: user.imageUrl || "",
        });
        setStatus("All set! Taking you to your feed...");
        setTimeout(() => router.push("/feed"), 800);
      } catch (err) {
        console.error("Registration error:", err);
        // 400 likely means user already exists — just redirect
        if (err.response?.status === 400 || err.response?.status === 409) {
          router.push("/feed");
        } else {
          setError(true);
          setStatus("Something went wrong. Please try refreshing.");
        }
      }
    };

    register();
  }, [isLoaded, user]);

  return (
    <main style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)", flexDirection: "column", gap: "1.25rem",
    }}>
      {!error ? (
        <div style={{
          width: 44, height: 44, border: "3px solid var(--brand)", borderTopColor: "transparent",
          borderRadius: "50%", animation: "spin 0.8s linear infinite",
        }} />
      ) : (
        <span style={{ fontSize: "2rem" }}>⚠️</span>
      )}
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>{status}</p>
      {error && (
        <button onClick={() => window.location.reload()}
          style={{ background: "var(--brand)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.625rem 1.5rem", fontWeight: 700, cursor: "pointer" }}>
          Retry
        </button>
      )}
    </main>
  );
}
