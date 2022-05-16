const mongoose = require("mongoose");

const SupportingDocumentsSchema = new mongoose.Schema({

  employeeName: {
    type: String,
  },
  employeeEmail: {
    type: String,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectInitiation"
  },
  projectTitle: {
    type: String,
  },
  documentName: {
    type: String,
  },
  files: {
    type: Array,
  },
  description: {
    type: String,
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

module.exports = mongoose.model("SupportingDocuments", SupportingDocumentsSchema);
