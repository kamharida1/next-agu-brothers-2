// /models/DailyProfit.js

import mongoose from 'mongoose';

const profitSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true, // Ensures only one record per day
    },
    totalProfit: {
      type: Number,
      required: true,
      default: 0,
    },
    cumulativeProfit: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const ProfitModel = mongoose.models.Profit || mongoose.model('Profit', profitSchema);

export default ProfitModel;
