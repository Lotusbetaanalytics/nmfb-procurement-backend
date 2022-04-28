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
    type: "ProjectInitiation"
  },
  projectTitle: {
    type: String,
  },
  projectType: {
    type: mongoose.Schema.Types.ObjectId,
    type: "ProjectType"
  },
  contractType: {
    type: mongoose.Schema.Types.ObjectId,
    type: "ContractType"
  },
  budgetLineItem: {
    type: mongoose.Schema.Types.ObjectId,
    type: "BudgetLineItem"
  },
  projectCategory: {
    type: mongoose.Schema.Types.ObjectId,
    type: "ProjectCategory"
  },
  vendorName: {
    type: String,
  },
  responsibleUnit: {
    type: mongoose.Schema.Types.ObjectId,
    type: "Team"
  },
  responsibleOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    type: "Staff"
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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("ProjectOnboarding", ProjectOnboardingSchema);
