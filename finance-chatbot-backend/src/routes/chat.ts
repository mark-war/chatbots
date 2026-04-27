// src/routes/chat.ts
import mongoose from "mongoose";
import { Router } from "express";
import TransactionModel from "../models/Transaction.js";
import fetch from "node-fetch";

const router = Router();
const Transaction = TransactionModel as any;

router.post("/query", async (req, res) => {
  try {
    const { question, userId = "demo" } = req.body as {
      question: string;
      userId?: string;
    };

    // -----------------------------------------------------------------
    // 1. DB connection guard
    // -----------------------------------------------------------------
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ error: "Database not connected" });
    }

    // -----------------------------------------------------------------
    // 2. Pull transactions – the only line that caused TS overload errors
    // -----------------------------------------------------------------
    //   .find() → Query → .lean() → LeanDocument[] → .exec() → Promise<any[]>
    //   The `as any[]` silences the overload-resolution problem.
    const transactions = (await Transaction.find({ userId })
      .lean()
      .exec()) as any[];

    if (transactions.length === 0) {
      return res.json({
        answer: "No transactions found. Upload a CSV first.",
      });
    }

    // -----------------------------------------------------------------
    // 3. Normalise ObjectId → string (JSON.stringify can’t handle ObjectId)
    // -----------------------------------------------------------------
    const cleanTransactions = transactions.map((tx: any) => ({
      ...tx,
      _id: tx._id?.toString(),
    }));

    const dataJson = JSON.stringify(cleanTransactions, null, 2);

    // -----------------------------------------------------------------
    // 4. Prompt for Groq
    // -----------------------------------------------------------------
    const prompt = `
You are a personal finance assistant. Use ONLY the data below to answer.

Transactions:
${dataJson}

Question: ${question}

Answer in 1-2 short sentences. Use $ for amounts. Be precise.`;

    // -----------------------------------------------------------------
    // 5. Call Groq
    // -----------------------------------------------------------------
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 150,
          temperature: 0,
        }),
      }
    );

    if (!groqRes.ok) {
      const errorText = await groqRes.text();
      console.error("Groq error:", errorText);
      return res.status(500).json({ error: "AI service error" });
    }

    const data: any = await groqRes.json();
    const answer = data.choices?.[0]?.message?.content?.trim() ?? "No answer";

    res.json({ answer });
  } catch (err: any) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

export default router;
