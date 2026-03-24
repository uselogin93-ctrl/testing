"use client";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import PostCard from "@/components/PostCard";

export default function ExplorePage() {
  const api = useApi();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get("/api/posts/explore");
      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <main className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-white">🔭 Explore</h1>
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">Loading...</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} onUpdate={fetchPosts} />)
        )}
      </div>
    </main>
  );
}
