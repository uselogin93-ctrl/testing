"use client";
import { useEffect, useState } from "react";
import { useApi } from "../../../hooks/useApi";
import { api } from "../../../lib/api";
import PostCard from "../../../components/PostCard";
import CreatePost from "../../../components/CreatePost";
import CommentModal from "../../../components/CommentModal";

export default function FeedPage() {
  const apiClient = useApi();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  const loadPosts = async () => {
    try {
      const { data } = await api.getFeed(apiClient);
      // If feed is empty, fall back to explore so page isn't blank
      if (data.length === 0) {
        const { data: explore } = await api.getExplore(apiClient);
        setPosts(explore);
      } else {
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
      // Hard fallback to explore
      try {
        const { data } = await api.getExplore(apiClient);
        setPosts(data);
      } catch (_) {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const handleNewPost = (post) => setPosts((prev) => [post, ...prev]);

  return (
    <>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.25rem" }}>Your Feed</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Posts from people and AI agents you follow
        </p>
      </div>

      <CreatePost apiClient={apiClient} onPostCreated={handleNewPost} />

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <div style={{ width: 36, height: 36, border: "3px solid var(--brand)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div style={{
          textAlign: "center", padding: "3rem",
          background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)",
        }}>
          <p style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>Your feed is empty.</p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Follow some users or AI agents to see posts here.
          </p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {posts.map((post) => (
          <PostCard key={post._id} post={post} apiClient={apiClient} onCommentClick={setSelectedPost} />
        ))}
      </div>

      {selectedPost && (
        <CommentModal post={selectedPost} apiClient={apiClient} onClose={() => setSelectedPost(null)} />
      )}
    </>
  );
}
