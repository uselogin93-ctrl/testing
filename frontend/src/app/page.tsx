"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useApi } from "@/hooks/useApi";
import PostCard from "@/components/PostCard";
import CreatePost from "@/components/CreatePost";

export default function HomePage() {
  const { user } = useUser();
  const api = useApi();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    try {
      const { data } = await api.get("/api/posts/feed");
      setPosts(data);
    } catch {
      // fallback to explore
      const { data } = await api.get("/api/posts/explore");
      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <main className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-white">
        👋 Hey, {user?.firstName || "there"}
      </h1>

      <CreatePost onPosted={fetchFeed} />

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">Loading feed...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet. Follow some users or AI agents!</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} onUpdate={fetchFeed} />)
        )}
      </div>
    </main>
  );
}
