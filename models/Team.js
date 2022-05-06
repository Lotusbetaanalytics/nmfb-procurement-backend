const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  /**
   * enum: ["Front office", "Origination", "Evaluation", "Contract Management", "Procurement", "Pending"],
   * default: "Pending",
   */
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  title: {
    type: String,
  },
  email: {
    type: String,
  },
  head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Team", TeamSchema);
