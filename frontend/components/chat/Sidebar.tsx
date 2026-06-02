"use client";

import { useState } from "react";

type Session = {
  id: string;
  title: string | null;
};

type SidebarProps = {
  sessions: Session[];
  activeSession: string | null;
  onSelect: (id: string) => void;
  onNewSession: (session: Session) => void;
};

export default function Sidebar({
  sessions,
  activeSession,
  onSelect,
  onNewSession,
}: SidebarProps) {
  const [loading, setLoading] = useState(false);

  const createSession = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/chat/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: Session = await res.json();

      onNewSession(data);
    } catch (err) {
      console.error("Failed to create session:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-72 h-screen bg-gray-950 border-r border-gray-800 flex flex-col">

      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={createSession}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-white text-black py-2 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></span>
              Creating...
            </>
          ) : (
            "+ New Chat"
          )}
        </button>
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">

        {sessions.length === 0 && (
          <div className="text-gray-500 text-sm text-center mt-6">
            No chats yet
          </div>
        )}

        {sessions.map((s) => (
          <div
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`p-3 rounded-lg cursor-pointer text-sm transition
              ${
                activeSession === s.id
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }
            `}
          >
            <div className="truncate">
              {s.title?.trim() || "Untitled Chat"}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-800 text-xs text-gray-600">
        AI Document Assistant
      </div>

    </div>
  );
}