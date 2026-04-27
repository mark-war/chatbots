import { Router } from "express";
import { parse } from "csv-parse";
import Transaction from "../models/Transaction.js";
import fetch from "node-fetch";

const router = Router();

// === AI CATEGORIZE (FREE with Groq) ===
async function categorize(
  description: string,
  amount: number
): Promise<string> {
  const prompt = `Categorize in ONE word: "${description}" Amount: $${amount}\nExamples: Dining, Salary, Rent, Groceries, Entertainment`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 10,
    }),
  });

  if (!res.ok) return "Other";
  const data: any = await res.json();
  return (data.choices?.[0]?.message?.content || "Other").trim();
}

router.post("/upload", async (req, res) => {
  try {
    const { csv, userId = "demo" } = req.body;

    // Parse CSV
    const parser = parse(csv, { columns: true, skip_empty_lines: true });
    const records: any[] = [];
    for await (const record of parser) {
      records.push(record);
    }

    const results = [];
    for (const r of records) {
      const amount = parseFloat(r.Amount || "0");
      const category = await categorize(r.Description || "Unknown", amount);

      const tx = new Transaction({
        userId,
        date: new Date(r.Date || Date.now()),
        description: r.Description || "Unknown",
        amount,
        category,
      });
      await tx.save();
      results.push(tx);
    }

    res.json({ success: true, count: results.length });
  } catch (err: any) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
