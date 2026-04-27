import { Router } from "express";
import PortfolioModel from "../models/Portfolio.js";
import fetch from "node-fetch";

const Portfolio = PortfolioModel as any;
const router = Router();

router.post("/query", async (req, res) => {
  try {
    const { question, userId = "demo" } = req.body as {
      question: string;
      userId?: string;
    };

    const holdings = (await Portfolio.find({ userId }).lean().exec()) as any[];

    if (holdings.length === 0) {
      return res.json({
        answer: "No portfolio data. Upload your holdings first.",
      });
    }

    const dataJson = JSON.stringify(holdings, null, 2);

    const prompt = `
You are a professional portfolio advisor. Use ONLY the data below.

Holdings:
${dataJson}

Question: ${question}

Answer in 1-2 sentences. Use ₱ for PHP. Be precise and actionable.
`;

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
      const err = await groqRes.text();
      console.error("Groq error:", err);
      return res.status(500).json({ error: "AI failed" });
    }

    const data: any = await groqRes.json();
    const answer = data.choices?.[0]?.message?.content?.trim() ?? "No answer";

    res.json({ answer });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
