const mongoose = require("mongoose");
const {stageNames} = require("../utils/projectUtils")

const SupportingDocumentsSchema = new mongoose.Schema({
  /**
   * Documents for a project (scope/technical specification)
   * a. Signed ToR Checklist with Relevant/participating Bus
   * b. Initial Scope of work
   * 
   * Documents for cost estimation
   * a. RfP/RfQ/Bidding Documents etc as applicable
   * 
   * Documents for No Objection 
   * a. A
   *  i. Shortlist No-Objection & Prior Review (SNPR)Memo
   *  ii. SPN
   *  iii. Letter of intent
   *  iv. Letter of invitation
   * b. B
   *  i. SPN
   *  ii. Solicitation docs
   *  iii. Inhouse estimate
   * 
   * Documents for Issuance of SPN
   * a. Samples of adverts placed
   * b. LoI Template, RfP, RfQ, Bidding Documents SPN
   * 
   * Documents for Submission of Proposals
   * a. LOI from vendors 
   * b. Filled bid proposal submission checklist
   * 
   * Documents for Bid Opening Exercise
   * a. Bid opening checklist
   * b. Bid Opening Minutes
   * 
   * Documents for Evaluation of Bid/Proposal
   * a. Update score of each bidder
   * b. Update average score
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
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectInitiation",
    required: true,
  },
  projectTitle: {
    type: String,
  },
  /**
   * Project Stages:
   * • SCOPE/TOR/TECHNICAL SPECIFICATION
   * • COST ESTIMATION
   * • SELECTION METHOD
   * • NO OBJECTION
   * • ISSUANCE OF SPN
   * • SUBMISSION OF PROPOSALS
   * • BID OPENING EXERCISE
   * • EVALUATION OF BID OPENING EXERCISE
   * • CONTRACT RENEWAL / TERMINATION
   */
  // projectStage: {
  //   type: String,
  //   enum: Object.Keys(this.stageNames)
  // },
  projectStage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectStage",
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
  isApproved: {
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
