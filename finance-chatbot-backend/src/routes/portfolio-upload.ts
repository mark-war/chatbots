import { Router } from "express";
import PortfolioModel from "../models/Portfolio.js";

const Portfolio = PortfolioModel as any;
const router = Router();

router.post("/upload", async (req, res) => {
  try {
    const { data, userId = "demo" } = req.body;

    if (!Array.isArray(data)) {
      return res
        .status(400)
        .json({ error: "Data must be an array of holdings" });
    }

    // Validate each entry
    const records = data.map((item) => ({
      userId,
      Action: item.Action || "BUY | SELL",
      Code: item.Code || "",
      Name: item.Name || "",
      "Portfolio%": parseFloat(item["Portfolio%"]) || 0,
      PriceAverage: parseFloat(item.PriceAverage) || 0,
      PriceTotal: parseFloat(item.PriceTotal) || 0,
      Shares: parseInt(item.Shares) || 0,
      MarketValue: parseFloat(item.MarketValue) || 0,
      GainLoss: parseFloat(item.GainLoss) || 0,
      "%GainLoss": parseFloat(item["%GainLoss"]) || 0,
    }));

    await Portfolio.deleteMany({ userId });
    await Portfolio.insertMany(records);

    res.json({ success: true, count: records.length });
  } catch (err: any) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
