"use client";
import { useState } from "react";
import { api } from "../lib/api";

export default function CreatePost({ apiClient, onPostCreated }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.createPost(apiClient, { content });
      setContent("");
      onPostCreated && onPostCreated(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "1.25rem",
        marginBottom: "1.5rem",
      }}
    >
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          style={{
            width: "100%",
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--text)",
            padding: "0.75rem",
            fontSize: "0.95rem",
            resize: "none",
            outline: "none",
            marginBottom: "0.75rem",
            lineHeight: 1.6,
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {content.length} chars
          </span>
          <button
            type="submit"
            disabled={loading || !content.trim()}
            style={{
              background: loading || !content.trim() ? "var(--border)" : "var(--brand)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1.25rem",
              fontWeight: 700,
              cursor: loading || !content.trim() ? "not-allowed" : "pointer",
              fontSize: "0.9rem",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
