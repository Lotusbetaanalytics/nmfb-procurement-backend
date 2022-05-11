const mongoose = require("mongoose");

const ProjectTaskSchema = new mongoose.Schema({

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
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff"
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff"
  },
  reassignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff"
  },
  responsibleOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff"
  },
  responsibleUnit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  },
  comment: {
    type: String,
  },
  files: {
    type: Array,
  },
  status: {
    type: String,
    enum: ["Pending", "Started", "Reassigned", "On Hold", "Terminated", "Completed"],
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

module.exports = mongoose.model("ProjectTask", ProjectTaskSchema);
