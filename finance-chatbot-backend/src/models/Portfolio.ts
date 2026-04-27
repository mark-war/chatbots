import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema({
  userId: String,
  Action: String,
  Code: String,
  Name: String,
  "Portfolio%": Number,
  PriceAverage: Number,
  PriceTotal: Number,
  Shares: Number,
  MarketValue: Number,
  GainLoss: Number,
  "%GainLoss": Number,
});

export default mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);