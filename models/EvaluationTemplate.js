const mongoose = require("mongoose");

const EvaluationTemplateSchema = new mongoose.Schema({

  employeeName: {
    type: String,
  },
  employeeEmail: {
    type: String,
  },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ContractType"
  }, // Not sure how to Implement
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectInitiation"
  },
  projectTitle: {
    type: String,
  },
  projectType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectType"
  },
  evaluatingOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff"
  },
  businessUsersUnitName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  },
  validFor: {
    type: String,
  },
  comment: {
    type: String,
  },
  files: {
    type: Array,
  },
  status: {
    type: String,
    enum: ["Pending", "Started", "Completed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("EvaluationTemplate", EvaluationTemplateSchema);
