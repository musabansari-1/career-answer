// "use client";

// import { useState } from "react";

// type Message = {
//   role: "user" | "assistant";
//   content: string;
// };

// export default function ChatWindow({
//   sessionId,
//   messages,
//   setMessages,
// }: any) {
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const sendMessage = async () => {
//     if (!input.trim() || !sessionId) return;

//     const userMsg: Message = { role: "user", content: input };
//     const updated = [...messages, userMsg];

//     setMessages(updated);
//     setInput("");
//     setLoading(true);

//     const res = await fetch(
//       `http://localhost:8000/chat/session/${sessionId}/message`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: input }),
//       }
//     );

//     const data = await res.json();

//     setMessages([
//       ...updated,
//       { role: "assistant", content: data.answer },
//     ]);

//     setLoading(false);
//   };

//   return (
//     <div className="flex-1 flex flex-col bg-gray-900">

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-6 space-y-4">
//         {messages.map((m: Message, i: number) => (
//           <div
//             key={i}
//             className={`max-w-2xl px-4 py-3 rounded-lg text-sm whitespace-pre-wrap ${
//               m.role === "user"
//                 ? "ml-auto bg-blue-600"
//                 : "bg-gray-800"
//             }`}
//           >
//             {m.content}
//           </div>
//         ))}

//         {loading && (
//           <div className="text-gray-400 text-sm">Thinking...</div>
//         )}
//       </div>

//       {/* Input */}
//       <div className="p-4 border-t border-gray-800 flex gap-2">
//         <input
//           className="flex-1 bg-gray-800 px-4 py-3 rounded-lg text-sm outline-none"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Ask something..."
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />

//         <button
//           onClick={sendMessage}
//           className="bg-blue-600 px-5 py-3 rounded-lg text-sm"
//         >
//           Send
//         </button>
//       </div>

//     </div>
//   );
// }



// "use client";

// import { useState } from "react";

// type Source = {
//   content: string;
//   score: number;
// };

// type Message = {
//   role: "user" | "assistant";
//   content: string;
//   sources?: Source[];
// };

// export default function ChatWindow({
//   sessionId,
//   messages,
//   setMessages,
// }: {
//   sessionId: string | null;
//   messages: Message[];
//   setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
// }) {
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const sendMessage = async () => {
//     if (!input.trim() || !sessionId) return;

//     const userMsg: Message = { role: "user", content: input };
//     const updated = [...messages, userMsg];

//     setMessages(updated);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await fetch(
//         `http://localhost:8000/chat/session/${sessionId}/message`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ message: input }),
//         }
//       );

//       const data = await res.json();

//       const assistantMsg: Message = {
//         role: "assistant",
//         content: data.answer,
//         sources: data.sources,
//       };

//       setMessages([...updated, assistantMsg]);
//     } catch (err) {
//       setMessages([
//         ...updated,
//         {
//           role: "assistant",
//           content: "Something went wrong. Please try again.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex-1 flex flex-col bg-gray-900">

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-6 space-y-4">

//         {messages.map((m, i) => (
//           <div
//             key={i}
//             className={`max-w-2xl px-4 py-3 rounded-xl text-sm whitespace-pre-wrap shadow
//               ${
//                 m.role === "user"
//                   ? "ml-auto bg-blue-600 text-white"
//                   : "mr-auto bg-gray-800 text-gray-100 border border-gray-700"
//               }
//             `}
//           >
//             <div>{m.content}</div>

//             {/* SOURCES (only for assistant) */}
//             {m.role === "assistant" && m.sources && (
//               <div className="mt-3 pt-2 border-t border-gray-700 text-xs text-gray-400">
//                 <div className="font-medium text-gray-300 mb-1">
//                   Sources
//                 </div>

//                 {m.sources.map((s, idx) => (
//                   <div key={idx} className="mb-1">
//                     <span className="text-blue-400 font-medium">
//                       {(s.score * 100).toFixed(0)}%
//                     </span>{" "}
//                     <span className="text-gray-400">
//                       {s.content.slice(0, 120)}...
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}

//         {loading && (
//           <div className="text-gray-400 text-sm">Thinking...</div>
//         )}
//       </div>

//       {/* Input */}
//       <div className="p-4 border-t border-gray-800 flex gap-2">
//         <input
//           className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Ask something about your documents..."
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />

//         <button
//           onClick={sendMessage}
//           disabled={loading}
//           className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg text-sm font-medium disabled:opacity-50"
//         >
//           Send
//         </button>
//       </div>

//     </div>
//   );
// }




"use client";

import { useState } from "react";

type Source = {
  content: string;
  score: number;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  showSources?: boolean;
};

export default function ChatWindow({
  sessionId,
  messages,
  setMessages,
}: {
  sessionId: string | null;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;

    const userMsg: Message = { role: "user", content: input };
    const updated = [...messages, userMsg];

    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8000/chat/session/${sessionId}/message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        }
      );

      const data = await res.json();

      const assistantMsg: Message = {
        role: "assistant",
        content: data.answer,
        sources: data.sources || [],
        showSources: false, // collapsed by default
      };

      setMessages([...updated, assistantMsg]);
    } catch (err) {
      setMessages([
        ...updated,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-2xl px-4 py-3 rounded-xl text-sm whitespace-pre-wrap shadow
              ${
                m.role === "user"
                  ? "ml-auto bg-blue-600 text-white"
                  : "mr-auto bg-gray-800 text-gray-100 border border-gray-700"
              }
            `}
          >
            {/* MAIN MESSAGE */}
            <div className="leading-relaxed">{m.content}</div>

            {/* SOURCES (assistant only) */}
            {m.role === "assistant" && m.sources && m.sources.length > 0 && (
              <div className="mt-3 pt-2 border-t border-gray-700 text-xs">

                {/* Toggle button */}
                <button
                  onClick={() => {
                    setMessages((prev) =>
                      prev.map((msg, idx) =>
                        idx === i
                          ? { ...msg, showSources: !msg.showSources }
                          : msg
                      )
                    );
                  }}
                  className="text-blue-400 hover:underline mb-2"
                >
                  {m.showSources
                    ? `Hide Sources (${m.sources.length})`
                    : `Show Sources (${m.sources.length})`}
                </button>

                {/* Expanded sources */}
                {m.showSources && (
                  <div className="mt-2 space-y-2 text-gray-400">
                    {m.sources.map((s, idx) => (
                      <div
                        key={idx}
                        className="border-l border-gray-600 pl-2"
                      >
                        <div className="text-blue-400 font-medium">
                          {(s.score * 100).toFixed(0)}%
                        </div>
                        <div>
                          {s.content.slice(0, 140)}...
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Loading state */}
        {loading && (
          <div className="text-gray-400 text-sm">
            Thinking...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800 flex gap-2">
        <input
          className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something about your documents..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          Send
        </button>
      </div>

    </div>
  );
}