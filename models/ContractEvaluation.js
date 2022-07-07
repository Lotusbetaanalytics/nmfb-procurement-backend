const mongoose = require("mongoose");

const ContractEvaluationSchema = new mongoose.Schema({

  // creator name (createdBy.name)
  name: {
    type: String,
  },
  // creator email (createdBy.email)
  email: {
    type: String,
  },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contract",
    required: true,
  }, // Not Implemented
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectInitiation",
    required: true,
  },
  projectTitle: {
    type: String,
  },
  projectType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectType"
  },
  // Evaluating officer email
  evaluatingOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff"
  },
  // Configurable units in Nirsal PLC
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
