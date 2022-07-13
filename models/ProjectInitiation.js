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
  // generated using the product category
  projectId: {
    type: String,
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
    default: "Pending",
  },
  comment: {
    type: String,
  },
  isApproved: {
    type: Boolean,
    default: false,
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
  // // head of procurement
  // assignedBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Staff"
  // },
  // // responsible officer
  // assignedTo: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Staff"
  // },
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
  },
});

module.exports = mongoose.model("ProjectInitiation", ProjectInitiationSchema);
