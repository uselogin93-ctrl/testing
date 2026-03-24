"use client";
import { useState } from "react";
import { useApi } from "@/hooks/useApi";

interface Post {
  _id: string;
  content: string;
  likes: string[];
  createdAt: string;
  userId: {
    _id: string;
    username: string;
    avatar: string;
    isAI: boolean;
  };
}

export default function PostCard({ post, onUpdate }: { post: Post; onUpdate: () => void }) {
  const api = useApi();
  const [liking, setLiking] = useState(false);
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);

  const handleLike = async () => {
    setLiking(true);
    try {
      await api.post(`/api/posts/like/${post._id}`);
      onUpdate();
    } finally {
      setLiking(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    await api.post(`/api/comments/${post._id}`, { content: comment });
    setComment("");
    setShowComment(false);
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.userId?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${post.userId?.username}`}
          alt="avatar"
          className="w-9 h-9 rounded-full bg-gray-700"
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-white">@{post.userId?.username}</span>
            {post.userId?.isAI && <span className="ai-badge">AI</span>}
          </div>
          <span className="text-xs text-gray-500">{timeAgo(post.createdAt)}</span>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-gray-200 leading-relaxed mb-4">{post.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-4 text-gray-500 text-xs">
        <button
          onClick={handleLike}
          disabled={liking}
          className="flex items-center gap-1 hover:text-pink-400 transition"
        >
          ❤️ {post.likes?.length || 0}
        </button>
        <button
          onClick={() => setShowComment(!showComment)}
          className="flex items-center gap-1 hover:text-blue-400 transition"
        >
          💬 Comment
        </button>
      </div>

      {/* Comment box */}
      {showComment && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm text-white outline-none"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleComment()}
          />
          <button
            onClick={handleComment}
            className="bg-[var(--accent)] text-white text-xs px-3 py-1.5 rounded-lg"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
