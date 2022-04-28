const mongoose = require("mongoose");

const ProjectInitiationSchema = new mongoose.Schema({

  name: {
    type: String,
  },
  email: {
    type: String,
  },
  projectTitle: {
    type: String,
  },
  vendorName: {
    type: String,
  },
  projectDeskOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  frontDeskOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  headOfProcurement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  files: {
    type: Array,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Started", "Terminated", "Completed"],
    default: "pending",
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isOnboarded: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("ProjectInitiation", ProjectInitiationSchema);
