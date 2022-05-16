const mongoose = require("mongoose");

const EvaluationResponseSchema = new mongoose.Schema({

  employeeName: {
    type: String,
  },
  employeeEmail: {
    type: String,
  },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contract",
  },
  evaluationTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EvaluationTemplate",
  },
  response: {
    type: String,
  },
  score: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("EvaluationResponse", EvaluationResponseSchema);
