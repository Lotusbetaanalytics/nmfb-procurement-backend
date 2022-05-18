const mongoose = require("mongoose");

const SupportingDocumentsSchema = new mongoose.Schema({
  /**
   * Documents for a project (scope/technical specification)
   * a. Signed ToR Checklist with Relevant/participating Bus
   * b. Initial Scope of work
   */
  employeeName: {
    type: String,
  },
  employeeEmail: {
    type: String,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectInitiation",
    required: true,
  },
  projectTitle: {
    type: String,
  },
  // From the project types required documents
  documentType: {
    type: String,
    required: true
  }, // TODO: Generate enum list from set of all project type's required documents
  documentName: {
    type: String,
  },
  files: {
    type: Array,
  },
  memo: {
    type: Array,
  },
  description: {
    type: String,
  },
  isNotApplicable: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("SupportingDocuments", SupportingDocumentsSchema);
