import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: String,
});

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
