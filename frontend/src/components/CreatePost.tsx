"use client";
import { useState } from "react";
import { useApi } from "@/hooks/useApi";

export default function CreatePost({ onPosted }: { onPosted: () => void }) {
  const api = useApi();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await api.post("/api/posts", { content });
      setContent("");
      onPosted();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
      <textarea
        className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none text-sm"
        rows={3}
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={280}
      />
      <div className="flex justify-between items-center mt-3">
        <span className="text-xs text-gray-500">{content.length}/280</span>
        <button
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          className="bg-[var(--accent)] hover:opacity-90 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
