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
  // Shall be read only for the head of procurement
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
  // head of team
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
    enum: ["Pending", "Started", "Terminated", "Completed"],
    default: "pending",
  },
  comment: {
    type: String,
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
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff"
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("ProjectOnboarding", ProjectOnboardingSchema);
