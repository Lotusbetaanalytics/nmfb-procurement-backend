const mongoose = require("mongoose");

const ProjectTaskSchema = new mongoose.Schema({

  // creator name (createdBy.name)
  name: {
    type: String,
  },
  // creator email (createdBy.email)
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
  // the same as responsible officer/ head of team
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
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff"
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("ProjectTask", ProjectTaskSchema);
