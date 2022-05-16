const mongoose = require("mongoose");

const ContractSchema = new mongoose.Schema({

  title: {
    type: String,
  },
  description: {
    type: String,
  },
  validFor: {
    type: String,
  },
  score: {
    type: Number,
    default: 100,
  },
  isActive: {
    type: Boolean,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff"
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  deactivatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff"
  },
  deactivatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Contract", ContractSchema);
