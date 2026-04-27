// components/PortfolioGuide.tsx
"use client";
import { useState } from "react";

export default function PortfolioGuide() {
  const [messages, setMessages] = useState<
    Array<{ role: string; text: string }>
  >([]);
  const [question, setQuestion] = useState("");

  const ask = async () => {
    setMessages((m) => [...m, { role: "user", text: question }]);
    const res = await fetch("/api/portfolio/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, userId: "demo" }),
    });
    const data = await res.json();
    setMessages((m) => [...m, { role: "bot", text: data.answer }]);
    setQuestion("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Ask My Portfolio</h1>
      <div className="bg-gray-50 p-4 rounded-lg h-96 overflow-y-auto mb-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            <span
              className={`inline-block p-3 rounded-lg mb-2 ${
                m.role === "user" ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          placeholder="e.g. What’s my best performer?"
          className="flex-1 p-3 border rounded-lg"
        />
        <button
          onClick={ask}
          className="bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
