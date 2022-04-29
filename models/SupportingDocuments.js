const mongoose = require("mongoose");

const EvaluationSchema = new mongoose.Schema({

  employeeName: {
    type: String,
  },
  employeeEmail: {
    type: String,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectInitiation"
  },
  projectTitle: {
    type: String,
  },
  documentName: {
    type: String,
  },
  files: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Evaluation", EvaluationSchema);
