const mongoose = require("mongoose");

const ContractSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
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
    default: true
  },
  isTerminated: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff"
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff"
  },
  updatedAt: {
    type: Date,
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
