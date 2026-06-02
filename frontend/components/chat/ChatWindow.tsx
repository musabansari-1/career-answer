"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWindow({
  sessionId,
  messages,
  setMessages,
}: any) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;

    const userMsg: Message = { role: "user", content: input };
    const updated = [...messages, userMsg];

    setMessages(updated);
    setInput("");
    setLoading(true);

    const res = await fetch(
      `http://localhost:8000/chat/session/${sessionId}/message`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      }
    );

    const data = await res.json();

    setMessages([
      ...updated,
      { role: "assistant", content: data.answer },
    ]);

    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m: Message, i: number) => (
          <div
            key={i}
            className={`max-w-2xl px-4 py-3 rounded-lg text-sm whitespace-pre-wrap ${
              m.role === "user"
                ? "ml-auto bg-blue-600"
                : "bg-gray-800"
            }`}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm">Thinking...</div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800 flex gap-2">
        <input
          className="flex-1 bg-gray-800 px-4 py-3 rounded-lg text-sm outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 px-5 py-3 rounded-lg text-sm"
        >
          Send
        </button>
      </div>

    </div>
  );
}