"use client";
import { useState } from "react";

export default function PortfolioGuide() {
  const [json, setJson] = useState("");
  const [status, setStatus] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: string; text: string }>
  >([]);
  const [question, setQuestion] = useState("");

  const API_URL = "http://localhost:4000/api/portfolio";

  const upload = async () => {
    setStatus("Uploading...");
    let parsed;
    try {
      parsed = JSON.parse(json);
    } catch {
      return setStatus("Invalid JSON");
    }

    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: parsed, userId: "demo" }),
    });
    const result = await res.json();
    setStatus(
      result.success ? `Uploaded ${result.count} holdings!` : result.error
    );
  };

  const ask = async () => {
    setMessages((m) => [...m, { role: "user", text: question }]);
    const res = await fetch(`${API_URL}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, userId: "demo" }),
    });
    const data = await res.json();
    setMessages((m) => [...m, { role: "bot", text: data.answer }]);
    setQuestion("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold text-center">AI Portfolio Guide</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">1. Paste Your JSON Data</h2>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          placeholder="Paste your portfolio JSON here..."
          className="w-full h-64 p-3 border rounded-lg font-mono text-sm"
        />
        <button
          onClick={upload}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Upload JSON
        </button>
        <p className="mt-2 text-sm font-medium">{status}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">2. Ask AI</h2>
        <div className="h-64 overflow-y-auto p-4 bg-gray-50 rounded-lg mb-4">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : ""}>
              <span
                className={`inline-block p-3 rounded-lg mb-2 ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white border"
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
            placeholder="e.g. Best performer?"
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
    </div>
  );
}
