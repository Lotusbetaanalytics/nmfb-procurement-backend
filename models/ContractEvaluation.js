const mongoose = require("mongoose");

const ContractEvaluationSchema = new mongoose.Schema({

  employeeName: {
    type: String,
  },
  employeeEmail: {
    type: String,
  },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contract"
  }, // Not Implemented
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
    default: Date.now(),
  },
});

module.exports = mongoose.model("ContractEvaluation", ContractEvaluationSchema);
