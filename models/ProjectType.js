const mongoose = require("mongoose");

const ProjectTypeSchema = new mongoose.Schema({
  /**
   * • Services related
   * • Goods and work related
   * • Contract Renewal (not sure what this means) (wrong)
   * 
   * TODO:
   * Add required documents for each project type (and possible paths for each project type)
   * Services Related:
   * - Path A
   *  - a. Signed ToR Checklist with Relevant/participating Bus
   *  - b. Initial Scope of work
   * 
   * - Path B
   *  - a. Terms of Reference (ToR) from User BU
   *  - b. Signed ToR Checklist with Relevant Stakeholders
   * 
   * Goods and Works Related:
   * - Path A
   *  - a. Technical requirements from users BU
   *  - b. Upload signed copy of the technical specification Meetings
   */
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  // should be required if requiredDocumentSetTwo not sent
  requiredDocumentSetOne: [{
    type: String,
    required: function() {return !this.requiredDocumentSetTwo},
  }],
  requiredDocumentSetTwo: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("ProjectType", ProjectTypeSchema);
