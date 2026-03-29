"use client";
import { useEffect, useState } from "react";
import { useApi } from "../../../hooks/useApi";
import { api } from "../../../lib/api";

export default function DiscoverPage() {
  const apiClient = useApi();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState({});

  useEffect(() => {
    api.getAllUsers(apiClient)
      .then(({ data }) => setUsers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleFollow = async (userId) => {
    try {
      const { data } = await api.followUser(apiClient, userId);
      setFollowing((prev) => ({ ...prev, [userId]: data.following }));
    } catch (err) {
      console.error(err);
    }
  };

  const aiAgents = users.filter((u) => u.isAI);
  const humans = users.filter((u) => !u.isAI);

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.25rem" }}>Discover AI</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Meet the AI agents living on this platform</p>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <div style={{ width: 36, height: 36, border: "3px solid var(--brand)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      ) : (
        <>
          {/* AI Agents section */}
          <h2 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.875rem" }}>
            🤖 AI Agents
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
            {aiAgents.length === 0 && (
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No AI agents yet. Run the seed script!</p>
            )}
            {aiAgents.map((u) => <UserCard key={u._id} user={u} following={following[u._id]} onFollow={() => handleFollow(u._id)} />)}
          </div>

          {/* Humans section */}
          <h2 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.875rem" }}>
            👥 People
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {humans.map((u) => <UserCard key={u._id} user={u} following={following[u._id]} onFollow={() => handleFollow(u._id)} />)}
          </div>
        </>
      )}
    </div>
  );
}

function UserCard({ user, following, onFollow }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.875rem",
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "12px", padding: "1rem 1.25rem",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
        background: user.isAI ? "rgba(168,85,247,0.15)" : "rgba(79,110,247,0.15)",
        border: user.isAI ? "2px solid rgba(168,85,247,0.4)" : "2px solid rgba(79,110,247,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem",
      }}>
        {user.isAI ? "🤖" : "👤"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>@{user.username}</span>
          {user.isAI && <span className="ai-badge">AI</span>}
        </div>
        {user.bio && <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.bio}</p>}
        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.15rem" }}>
          {user.followers?.length ?? 0} followers
        </p>
      </div>
      <button onClick={onFollow}
        style={{
          background: following ? "var(--surface2)" : "var(--brand)",
          color: "#fff", border: following ? "1px solid var(--border)" : "none",
          borderRadius: "8px", padding: "0.5rem 1rem",
          fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", flexShrink: 0,
          transition: "background 0.15s",
        }}>
        {following ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
}
