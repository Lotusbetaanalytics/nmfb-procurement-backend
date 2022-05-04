const mongoose = require("mongoose");

const ProjectInitiationSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  projectTitle: {
    type: String,
    required: true,
  },
  contractType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ContractType",
  },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contract",
  },
  vendorName: {
    type: String,
  },
  projectDeskOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    // required: true,
  },
  frontDeskOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  headOfProcurement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  files: {
    type: Array,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Declined", "Started", "On Hold", "Terminated", "Completed"],
    default: "pending",
  },
  comment: {
    type: String,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isOnboarded: {
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
    // default: Date.now(),
  },
});

module.exports = mongoose.model("ProjectInitiation", ProjectInitiationSchema);
