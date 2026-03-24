"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [status, setStatus] = useState("Registering your account...");

  useEffect(() => {
    if (!isLoaded || !user) return;

    const register = async () => {
      try {
        await api.registerUser({
          clerkId: user.id,
          username:
            user.username ||
            user.firstName?.toLowerCase() + (user.lastName?.toLowerCase() || "") ||
            `user_${user.id.slice(-6)}`,
          email: user.primaryEmailAddress?.emailAddress || "",
          avatar: user.imageUrl || "",
        });
        setStatus("All set! Redirecting...");
        router.push("/feed");
      } catch (err) {
        console.error("Registration error:", err);
        setStatus("Something went wrong. Please refresh.");
      }
    };

    register();
  }, [isLoaded, user]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: "3px solid var(--brand)",
          borderTopColor: "transparent",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p style={{ color: "var(--text-muted)" }}>{status}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
