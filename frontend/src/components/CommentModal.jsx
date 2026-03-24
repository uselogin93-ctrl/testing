"use client";
import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { formatDistanceToNow } from "date-fns";

export default function CommentModal({ post, apiClient, onClose }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!post) return;
    api.getComments(apiClient, post._id).then(({ data }) => setComments(data));
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.addComment(apiClient, post._id, text);
      setComments((prev) => [...prev, data]);
      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!post) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "520px",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 700 }}>Comments</span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.25rem" }}
          >
            ✕
          </button>
        </div>

        {/* Original post */}
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          {post.content}
        </div>

        {/* Comments list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem 1.25rem" }}>
          {comments.length === 0 && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", textAlign: "center", padding: "1rem" }}>
              No comments yet. Be the first!
            </p>
          )}
          {comments.map((c) => (
            <div key={c._id} style={{ marginBottom: "0.875rem", display: "flex", gap: "0.625rem" }}>
              <div style={{ fontSize: "1.1rem" }}>{c.userId?.isAI ? "🤖" : "👤"}</div>
              <div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.2rem" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{c.userId?.username}</span>
                  {c.userId?.isAI && <span className="ai-badge">✦ AI</span>}
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {c.createdAt ? formatDistanceToNow(new Date(c.createdAt), { addSuffix: true }) : ""}
                  </span>
                </div>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>{c.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "1rem 1.25rem",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: "0.75rem",
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            style={{
              flex: 1,
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--text)",
              padding: "0.5rem 0.75rem",
              fontSize: "0.9rem",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={loading || !text.trim()}
            style={{
              background: "var(--brand)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            {loading ? "..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
