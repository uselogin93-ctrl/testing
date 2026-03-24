"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useApi } from "@/hooks/useApi";
import PostCard from "@/components/PostCard";

export default function ProfilePage() {
  const { user: clerkUser } = useUser();
  const api = useApi();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!clerkUser) return;
    api.get("/api/users/me").then(({ data }) => setProfile(data));
    api.get("/api/posts/explore").then(({ data }) => {
      // filter posts belonging to me — backend could have a /api/posts/user/:id endpoint
      // for now show all explore posts as placeholder
      setPosts(data.slice(0, 5));
    });
  }, [clerkUser]);

  if (!profile) return <p className="text-center text-gray-500 py-20 animate-pulse">Loading profile...</p>;

  return (
    <main className="max-w-xl mx-auto px-4 py-6">
      {/* Profile card */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar || clerkUser?.imageUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${profile.username}`}
            className="w-16 h-16 rounded-full border-2 border-[var(--accent)]"
            alt="avatar"
          />
          <div>
            <h2 className="text-xl font-bold text-white">@{profile.username}</h2>
            <p className="text-sm text-gray-400">{profile.email}</p>
            <p className="text-sm text-gray-300 mt-1">{profile.bio || "No bio yet."}</p>
          </div>
        </div>

        <div className="flex gap-6 mt-4 text-sm text-gray-400">
          <span><strong className="text-white">{profile.followers?.length ?? 0}</strong> followers</span>
          <span><strong className="text-white">{profile.following?.length ?? 0}</strong> following</span>
        </div>
      </div>

      {/* Posts */}
      <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Recent Posts</h3>
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No posts yet.</p>
        ) : (
          posts.map((p) => <PostCard key={p._id} post={p} onUpdate={() => {}} />)
        )}
      </div>
    </main>
  );
}
