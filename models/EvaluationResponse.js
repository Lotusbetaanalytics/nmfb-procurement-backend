const mongoose = require("mongoose");

const EvaluationResponseSchema = new mongoose.Schema({

  /**
   * Form fields
   * a. Update score of each bidder
   * 
   * Backend Logic
   * b. Update average score
   * 
   * Document Uploads
   * c. Upload approved copy of the technical evaluation report
   * d. Upload report of the financial bid
   * e. Upload solicitation document
   * f. Upload negotiation meeting agenda templates
   * g. Upload minutes of each meetings:
   *  i. Technical Negotiation Meeting
   *  ii. Financial Negotiation Meeting
   *  iii. Contract Agreement Negotiation
   * h. Upload technical evaluation report
   * i. Upload technical evaluation forwarding memo
   * j. Upload financial evaluation report
   */

  employeeName: {
    type: String,
  },
  employeeEmail: {
    type: String,
  },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contract",
    required: true,
  },
  evaluationTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EvaluationTemplate",
    required: true,
  },
  response: {
    type: String,
  },
  score: {
    type: String,
  },
  // EvaluatingOfficer
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("EvaluationResponse", EvaluationResponseSchema);
