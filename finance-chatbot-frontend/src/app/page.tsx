"use client";

import { useState } from "react";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  const [csv, setCsv] = useState("");
  const [status, setStatus] = useState("");

  const upload = async () => {
    const res = await fetch("http://localhost:4000/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv, userId: "user-123" }),
    });
    const data = await res.json();
    setStatus(
      data.success
        ? `Uploaded ${data.count} transactions!`
        : `Error: ${data.error}`
    );
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-2">
          AI Finance Chatbot
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Upload CSV → AI categorizes → Ask questions
        </p>

        <textarea
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          placeholder="Paste CSV: Date,Description,Amount"
          className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg font-mono text-sm"
        />

        <button
          onClick={upload}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
        >
          Upload & AI Categorize
        </button>

        {status && (
          <p
            className={`mt-4 text-center font-medium ${
              status.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {status}
          </p>
        )}

        <div className="mt-8 p-6 bg-gray-50 rounded-lg text-xs">
          <p className="font-bold">Test CSV:</p>
          <pre className="mt-2 overflow-x-auto">
            {`Date,Description,Amount
2025-03-01,Starbucks,-4.50
2025-03-02,Amazon,-89.99
2025-03-03,Salary,3500.00`}
          </pre>
        </div>
      </div>
      <ChatWidget />
    </main>
  );
}
