// "use client";

// import { useState } from "react";

// type Session = {
//   id: string;
//   title: string | null;
// };

// export default function Sidebar({
//   sessions,
//   activeSession,
//   onSelect,
//   onNewSession,
//   onUpdateSession,
//   onDeleteSession,
// }: any) {
//   const [loading, setLoading] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editText, setEditText] = useState("");

//   const createSession = async () => {
//     setLoading(true);

//     const res = await fetch("http://localhost:8000/chat/session", {
//       method: "POST",
//     });

//     const data = await res.json();
//     onNewSession(data);

//     setLoading(false);
//   };

//   const renameSession = async (id: string) => {
//     await fetch(`http://localhost:8000/chat/session/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ title: editText }),
//     });

//     onUpdateSession(id, editText);
//     setEditingId(null);
//   };

//   const deleteSession = async (id: string) => {
//     await fetch(`http://localhost:8000/chat/session/${id}`, {
//       method: "DELETE",
//     });

//     onDeleteSession(id);
//   };

//   return (
//     <div className="w-72 h-screen bg-black border-r border-gray-800 flex flex-col">

//       {/* Header */}
//       <div className="p-4 border-b border-gray-800">
//         <button
//           onClick={createSession}
//           disabled={loading}
//           className="w-full bg-white text-black py-2 rounded-lg font-medium hover:bg-gray-200"
//         >
//           {loading ? "Creating..." : "+ New Chat"}
//         </button>
//       </div>

//       {/* Sessions */}
//       <div className="flex-1 overflow-y-auto p-2 space-y-2">

//         {sessions.map((s: Session) => (
//           <div
//             key={s.id}
//             className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer ${
//               activeSession === s.id
//                 ? "bg-gray-800"
//                 : "hover:bg-gray-900"
//             }`}
//           >

//             {/* Title */}
//             <div
//               className="flex-1 text-sm text-gray-200"
//               onClick={() => onSelect(s.id)}
//             >
//               {editingId === s.id ? (
//                 <input
//                   value={editText}
//                   onChange={(e) => setEditText(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") renameSession(s.id);
//                   }}
//                   className="bg-gray-700 px-2 py-1 rounded w-full text-white"
//                   autoFocus
//                 />
//               ) : (
//                 <span className="truncate block">
//                   {s.title || "Untitled Chat"}
//                 </span>
//               )}
//             </div>

//             {/* Actions */}
//             <div className="hidden group-hover:flex gap-2 text-xs">

//               {/* Rename */}
//               <button
//                 onClick={() => {
//                   setEditingId(s.id);
//                   setEditText(s.title || "");
//                 }}
//                 className="text-blue-400"
//               >
//                 Rename
//               </button>

//               {/* Delete */}
//               <button
//                 onClick={() => deleteSession(s.id)}
//                 className="text-red-400"
//               >
//                 Delete
//               </button>
//             </div>

//           </div>
//         ))}
//       </div>

//       {/* Footer */}
//       <div className="p-3 border-t border-gray-800 text-xs text-gray-600">
//         AI Chat System
//       </div>

//     </div>
//   );
// }



"use client";

import { useState } from "react";

type Session = {
  id: string;
  title: string | null;
};

export default function Sidebar({
  sessions,
  activeSession,
  onSelect,
  onNewSession,
  onUpdateSession,
  onDeleteSession,
}: any) {
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const createSession = async () => {
    setLoading(true);

    const res = await fetch("http://localhost:8000/chat/session", {
      method: "POST",
    });

    const data = await res.json();
    onNewSession(data);

    setLoading(false);
  };

  const renameSession = async (id: string) => {
    await fetch(`http://localhost:8000/chat/session/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editText }),
    });

    onUpdateSession(id, editText);
    setEditingId(null);
  };

  const deleteSession = async (id: string) => {
    await fetch(`http://localhost:8000/chat/session/${id}`, {
      method: "DELETE",
    });

    onDeleteSession(id);
  };

  return (
    <div className="w-72 h-screen bg-[#0A0A0A] border-r border-white/5 flex flex-col">

      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <button
          onClick={createSession}
          disabled={loading}
          className="w-full bg-white text-black py-2.5 rounded-xl font-medium text-sm
                     hover:bg-gray-200 transition active:scale-[0.98]"
        >
          {loading ? "Creating..." : "+ New Chat"}
        </button>
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">

        {sessions.map((s: Session) => {
          const isActive = activeSession === s.id;

          return (
            <div
              key={s.id}
              className={`group flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition
                ${
                  isActive
                    ? "bg-white/10 border border-white/10"
                    : "hover:bg-white/5"
                }
              `}
            >

              {/* Title */}
              <div
                className="flex-1 min-w-0"
                onClick={() => onSelect(s.id)}
              >
                {editingId === s.id ? (
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") renameSession(s.id);
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-sm text-white outline-none"
                    autoFocus
                  />
                ) : (
                  <div className="text-sm text-gray-200 truncate">
                    {s.title || "Untitled chat"}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">

                {/* Rename */}
                <button
                  onClick={() => {
                    setEditingId(s.id);
                    setEditText(s.title || "");
                  }}
                  className="p-1.5 rounded-md hover:bg-white/10 transition"
                  title="Rename"
                >
                  ✏️
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteSession(s.id)}
                  className="p-1.5 rounded-md hover:bg-red-500/10 transition"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/5 text-xs text-gray-500">
        AI Chat Workspace
      </div>

    </div>
  );
}