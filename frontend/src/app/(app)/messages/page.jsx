"use client";
import { useEffect, useState, useRef } from "react";
import { useApi } from "../../../hooks/useApi";
import { api } from "../../../lib/api";

export default function MessagesPage() {
  const apiClient = useApi();
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    api.getAllUsers(apiClient).then(({ data }) => setUsers(data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selected) return;
    api.getMessages(apiClient, selected._id)
      .then(({ data }) => setMessages(data))
      .catch(console.error);
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !selected || sending) return;
    setSending(true);
    try {
      const { data } = await api.sendMessage(apiClient, selected._id, input.trim());
      setMessages((prev) => [...prev, data]);
      setInput("");
      // Poll for AI reply after 1.5s
      if (selected.isAI) {
        setTimeout(async () => {
          const { data: updated } = await api.getMessages(apiClient, selected._id);
          setMessages(updated);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "1rem", height: "calc(100vh - 3rem)" }}>
      {/* User list */}
      <div style={{
        width: "200px", flexShrink: 0,
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "1rem", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: "0.9rem" }}>
          Messages
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {users.map((u) => (
            <button key={u._id} onClick={() => setSelected(u)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "0.625rem",
                padding: "0.75rem 1rem", background: selected?._id === u._id ? "var(--brand)" : "transparent",
                border: "none", cursor: "pointer", color: selected?._id === u._id ? "#fff" : "var(--text)",
                textAlign: "left", borderBottom: "1px solid var(--border)", transition: "background 0.15s",
              }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: u.isAI ? "rgba(168,85,247,0.2)" : "rgba(79,110,247,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem",
              }}>
                {u.isAI ? "🤖" : "👤"}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  @{u.username}
                </div>
                {u.isAI && <span className="ai-badge" style={{ fontSize: "9px" }}>AI</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat panel */}
      <div style={{
        flex: 1, background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "12px", display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {selected ? (
          <>
            {/* Header */}
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <span style={{ fontSize: "1.1rem" }}>{selected.isAI ? "🤖" : "👤"}</span>
              <span style={{ fontWeight: 700 }}>@{selected.username}</span>
              {selected.isAI && <span className="ai-badge">AI</span>}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {messages.length === 0 && (
                <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem", fontSize: "0.875rem" }}>
                  No messages yet. Say hello!
                </p>
              )}
              {messages.map((m) => {
                const fromMe = m.senderId?._id !== selected._id && m.senderId !== selected._id;
                return (
                  <div key={m._id} style={{ display: "flex", justifyContent: fromMe ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "70%", padding: "0.625rem 0.875rem", borderRadius: "12px", fontSize: "0.9rem",
                      background: fromMe ? "var(--brand)" : "var(--surface2)",
                      color: fromMe ? "#fff" : "var(--text)",
                    }}>
                      {m.content}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: "1rem", borderTop: "1px solid var(--border)", display: "flex", gap: "0.625rem" }}>
              <input value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder={`Message @${selected.username}...`}
                style={{
                  flex: 1, background: "var(--surface2)", border: "1px solid var(--border)",
                  borderRadius: "8px", color: "var(--text)", padding: "0.625rem 0.875rem",
                  fontSize: "0.9rem", outline: "none",
                }} />
              <button onClick={sendMessage} disabled={sending || !input.trim()}
                style={{
                  background: "var(--brand)", color: "#fff", border: "none",
                  borderRadius: "8px", padding: "0.625rem 1.25rem",
                  fontWeight: 700, cursor: sending ? "wait" : "pointer",
                  opacity: (!input.trim() || sending) ? 0.5 : 1,
                }}>
                {sending ? "..." : "Send"}
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
