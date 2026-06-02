"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    const updated = [...messages, userMessage];

    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: updated,
        }),
      });

      const data = await res.json();

      setMessages([
        ...updated,
        { role: "assistant", content: data.answer },
      ]);
    } catch (err) {
      setMessages([
        ...updated,
        { role: "assistant", content: "Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col">

      {/* Header */}
      <div className="backdrop-blur-xl bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold tracking-wide">
          Career Answer
        </div>
        {/* <div className="text-xs text-gray-400">
          RAG + OpenRouter
        </div> */}
      </div>

      {/* Chat container */}
      <div className="flex-1 overflow-y-auto px-4 md:px-10 py-6">
        <div className="max-w-3xl mx-auto space-y-6">

          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-20">
              <p className="text-xl font-medium text-white">
                Ask anything about your documents
              </p>
              <p className="text-sm mt-2">
                Try: "What is my experience with FastAPI?"
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar */}
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs">
                  AI
                </div>
              )}

              {/* Bubble */}
              <div
                className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-lg whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white/10 text-gray-100 border border-white/10 rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>

              {/* Avatar user */}
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                  You
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs">
                AI
              </div>
              <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl text-sm flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-150">.</span>
                <span className="animate-bounce delay-300">.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-white/10 bg-black/40 backdrop-blur-xl p-4">
        <div className="max-w-3xl mx-auto flex gap-3">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask something about your documents..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl text-sm font-medium disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}