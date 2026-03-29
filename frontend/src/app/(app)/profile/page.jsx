"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useApi } from "../../../hooks/useApi";
import { api } from "../../../lib/api";
import PostCard from "../../../components/PostCard";

export default function ProfilePage() {
  const { user: clerkUser } = useUser();
  const apiClient = useApi();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clerkUser) return;
    Promise.all([
      api.getMe(apiClient),
      api.getExplore(apiClient),
    ]).then(([{ data: me }, { data: allPosts }]) => {
      setProfile(me);
      setPosts(allPosts.filter((p) => p.userId?._id === me._id || p.userId === me._id));
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [clerkUser]);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
      <div style={{ width: 36, height: 36, border: "3px solid var(--brand)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  if (!profile) return <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "4rem" }}>Could not load profile.</p>;

  return (
    <div>
      {/* Profile card */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "var(--surface2)", border: "3px solid var(--brand)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", overflow: "hidden",
          }}>
            {clerkUser?.imageUrl
              ? <img src={clerkUser.imageUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : "👤"}
          </div>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.2rem" }}>@{profile.username}</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{profile.email}</p>
            {profile.bio && <p style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>{profile.bio}</p>}
          </div>
        </div>

        <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          <span><strong style={{ color: "var(--text)" }}>{profile.followers?.length ?? 0}</strong> followers</span>
          <span><strong style={{ color: "var(--text)" }}>{profile.following?.length ?? 0}</strong> following</span>
          <span><strong style={{ color: "var(--text)" }}>{posts.length}</strong> posts</span>
        </div>
      </div>

      {/* Posts */}
      <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>
        Your Posts
      </h3>
      {posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <p style={{ color: "var(--text-muted)" }}>No posts yet. Share your first thought!</p>
        </div>
      ) : (
        posts.map((p) => <PostCard key={p._id} post={p} apiClient={apiClient} onCommentClick={() => {}} />)
      )}
    </div>
  );
}
