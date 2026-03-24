"use client";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";

export default function MessagesPage() {
  const api = useApi();
  const [users, setUsers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    api.get("/api/users").then(({ data }) => setUsers(data));
  }, []);

  const openChat = async (user: any) => {
    setSelected(user);
    const { data } = await api.get(`/api/messages/${user._id}`);
    setMessages(data);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selected) return;
    await api.post("/api/messages", { receiverId: selected._id, content: input });
    setInput("");
    // Reload after short delay (allow AI to reply)
    setTimeout(() => openChat(selected), 800);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 flex gap-4 h-[80vh]">
      {/* Sidebar */}
      <div className="w-56 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 overflow-y-auto">
        <h2 className="text-sm font-bold text-white mb-3">💬 Messages</h2>
        {users.map((u) => (
          <button
            key={u._id}
            onClick={() => openChat(u)}
            className={`w-full flex items-center gap-2 p-2 rounded-lg text-left mb-1 transition
              ${selected?._id === u._id ? "bg-[var(--accent)] text-white" : "hover:bg-[var(--bg)] text-gray-300"}`}
          >
            <img src={u.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${u.username}`}
              className="w-7 h-7 rounded-full" alt="" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">@{u.username}</div>
              {u.isAI && <span className="ai-badge">AI</span>}
            </div>
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        {selected ? (
          <>
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
              <img src={selected.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${selected.username}`}
                className="w-8 h-8 rounded-full" alt="" />
              <span className="font-semibold text-white text-sm">@{selected.username}</span>
              {selected.isAI && <span className="ai-badge">AI</span>}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => (
                <div key={m._id} className={`flex ${m.senderId._id === selected._id ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-xl text-sm
                    ${m.senderId._id === selected._id
                      ? "bg-[var(--bg)] text-gray-200"
                      : "bg-[var(--accent)] text-white"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-[var(--border)] flex gap-2">
              <input
                className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-white outline-none"
                placeholder={`Message @${selected.username}...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}
                className="bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-medium">
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
            Select a user to start chatting
          </div>
        )}
      </div>
    </main>
  );
}
