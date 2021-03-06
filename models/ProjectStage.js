const mongoose = require("mongoose");

const ProjectStageSchema = new mongoose.Schema({
  /**
   * SCOPE/TOR/TECHNICAL SPECIFICATION
   * COST ESTIMATION
   * SELECTION METHOD
   * NO OBJECTION
   * ISSUANCE OF SPN
   * SUBMISSION OF PROPOSALS
   * BID OPENING EXERCISE
   * EVALUATION OF BID OPENING EXERCISE
   * CONTRACT RENEWAL / TERMINATION
   */
  title: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
  },
  requiredDocuments: {
    type: Array
  },
  alternativeDocuments: {
    type: Array
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("ProjectStage", ProjectStageSchema);
