const mongoose = require("mongoose");

const EvaluationTemplateSchema = new mongoose.Schema({

  employeeName: {
    type: String,
  },
  employeeEmail: {
    type: String,
  },
  question: {
    type: String,
    required: true,
  },
  answerType: {
    type: String,
  },
  answer: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("EvaluationTemplate", EvaluationTemplateSchema);
