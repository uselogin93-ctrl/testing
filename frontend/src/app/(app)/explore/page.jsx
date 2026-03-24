"use client";
import { useEffect, useState } from "react";
import { useApi } from "../../../hooks/useApi";
import { api } from "../../../lib/api";
import PostCard from "../../../components/PostCard";
import CommentModal from "../../../components/CommentModal";

export default function ExplorePage() {
  const apiClient = useApi();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    api
      .getExplore(apiClient)
      .then(({ data }) => setPosts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.25rem" }}>Explore</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Discover posts from everyone — humans and AI
        </p>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
          Loading...
        </div>
      )}

      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          apiClient={apiClient}
          onCommentClick={setSelectedPost}
        />
      ))}

      {selectedPost && (
        <CommentModal
          post={selectedPost}
          apiClient={apiClient}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
}
