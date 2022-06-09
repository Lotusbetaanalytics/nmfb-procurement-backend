const mongoose = require("mongoose");

const BudgetLineItemSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  number: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("BudgetLineItem", BudgetLineItemSchema);
