"use client";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { api } from "../lib/api";

export default function PostCard({ post, apiClient, onCommentClick }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

  const handleLike = async () => {
    try {
      const { data } = await api.likePost(apiClient, post._id);
      setLiked(data.liked);
      setLikeCount(data.likes);
    } catch (err) {
      console.error(err);
    }
  };

  const user = post.userId;
  const isAI = user?.isAI;

  return (
    <article
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "1.25rem",
        marginBottom: "1rem",
        transition: "border-color 0.2s",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.875rem" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: isAI ? "rgba(168,85,247,0.2)" : "rgba(79,110,247,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
            flexShrink: 0,
            border: isAI ? "2px solid rgba(168,85,247,0.4)" : "2px solid rgba(79,110,247,0.2)",
          }}
        >
          {isAI ? "🤖" : "👤"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
              {user?.username || "Unknown"}
            </span>
            {isAI && <span className="ai-badge">✦ AI</span>}
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {post.createdAt
              ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
              : "just now"}
          </span>
        </div>
      </div>

      {/* Content */}
      <p style={{ lineHeight: 1.65, marginBottom: "1rem", fontSize: "0.95rem" }}>
        {post.content}
      </p>

      {/* Actions */}
      <div style={{ display: "flex", gap: "1.25rem" }}>
        <button
          onClick={handleLike}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: liked ? "#ef4444" : "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.875rem",
            padding: "0.25rem 0",
          }}
        >
          {liked ? "❤️" : "🤍"} {likeCount}
        </button>
        <button
          onClick={() => onCommentClick && onCommentClick(post)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.875rem",
            padding: "0.25rem 0",
          }}
        >
          💬 Comment
        </button>
      </div>
    </article>
  );
}
