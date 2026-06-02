"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/chat/Sidebar";
import ChatWindow from "@/components/chat/ChatWindow";

type Session = {
  id: string;
  title: string | null;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // ----------------------------
  // Load sessions
  // ----------------------------
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoadingSessions(true);

        const res = await fetch("http://localhost:8000/chat/sessions");
        const data: Session[] = await res.json();

        setSessions(data);

        // auto-select first session only if none selected
        if (data.length > 0 && !activeSession) {
          setActiveSession(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load sessions:", err);
      } finally {
        setLoadingSessions(false);
      }
    };

    loadSessions();
  }, []);

  // ----------------------------
  // Load messages when session changes
  // ----------------------------
  useEffect(() => {
    const loadMessages = async () => {
      if (!activeSession) return;

      try {
        const res = await fetch(
          `http://localhost:8000/chat/session/${activeSession}`
        );

        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    loadMessages();
  }, [activeSession]);

  // ----------------------------
  // Sidebar handlers
  // ----------------------------

  const handleNewSession = (session: Session) => {
    setSessions((prev) => [session, ...prev]);
    setActiveSession(session.id);
    setMessages([]);
  };

  const handleUpdateSession = (id: string, title: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title } : s))
    );
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));

    if (activeSession === id) {
      const remaining = sessions.filter((s) => s.id !== id);
      setActiveSession(remaining.length > 0 ? remaining[0].id : null);
      setMessages([]);
    }
  };

  return (
    <div className="h-screen flex bg-black text-white">

      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSession={activeSession}
        onSelect={setActiveSession}
        onNewSession={handleNewSession}
        onUpdateSession={handleUpdateSession}
        onDeleteSession={handleDeleteSession}
      />

      {/* Chat */}
      <ChatWindow
        sessionId={activeSession}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
}