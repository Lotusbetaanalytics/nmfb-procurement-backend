const mongoose = require("mongoose");

const ProjectOnboardingSchema = new mongoose.Schema({

  name: {
    type: String,
  },
  email: {
    type: String,
  },
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
  contractType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ContractType"
  },
  budgetLineItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BudgetLineItem"
  },
  projectCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectCategory"
  },
  vendorName: {
    type: String,
  },
  responsibleUnit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  },
  responsibleOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff"
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff"
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff"
  },
  files: {
    type: Array,
  },
  status: {
    type: String,
    enum: ["Pending", "Started", "Completed"],
    default: "pending",
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff"
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("ProjectOnboarding", ProjectOnboardingSchema);
