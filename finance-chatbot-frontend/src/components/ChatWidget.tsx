"use client";

import { useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "bot"; text: string }>
  >([]);

  const send = async () => {
    if (!question.trim()) return;
    setMessages((m) => [...m, { role: "user", text: question }]);

    const res = await fetch("http://localhost:4000/api/chat/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, userId: "user-123" }),
    });

    const data = await res.json();
    setMessages((m) => [
      ...m,
      { role: "bot", text: data.answer || data.error },
    ]);
    setQuestion("");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition"
      >
        💬
      </button>

      {/* Chat Modal */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-4 font-bold text-center">
            AI Finance Assistant
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : ""}>
                <div
                  className={`inline-block max-w-xs p-3 rounded-2xl ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about your money..."
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={send}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
