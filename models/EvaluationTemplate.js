const mongoose = require("mongoose");

const EvaluationTemplateSchema = new mongoose.Schema({

  // creator name (createdBy.name)
  name: {
    type: String,
  },
  // creator email (createdBy.email)
  email: {
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
