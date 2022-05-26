const asyncHandler = require("../middleware/async");
const ProjectStage = require("../models/ProjectStage");
const ProjectType = require("../models/ProjectType");
const {token} = require("./scripts");


exports.generateProjectId = asyncHandler(async project => {
  try {
    const projectType = await ProjectType.findById(project.projectType);
    const projectId = `${projectType.title}-${project.title}-${token(10)}`;
    return projectId;
  } catch (err) {
    console.log(err.message);
    return null;
  }
});

exports.stageNames = {
  "SCOPE/TOR/TECHNICAL SPECIFICATION": {
    "pathA": [
      "Signed ToR Checklist with Relevant/participating Bus",
      "Initial Scope of work",
    ],
  },
  "COST ESTIMATION": {
    "pathA": [
      "RfP/RfQ/Bidding Documents etc as applicable",
    ],
  },
  "SELECTION METHOD": {
    // TODO: Change to relevant documents
    "pathA": [
      "RfP/RfQ/Bidding Documents etc as applicable",
    ],
  },
  "NO OBJECTION": {
    "pathA": [
      "Shortlist No-Objection & Prior Review (SNPR)Memo",
      "SPN",
      "Letter of intent",
      "Letter of invitation",
    ],
    "pathB": [
      "SPN",
      "Solicitation docs",
      "Inhouse estimate",
    ]
  },
  "ISSUANCE OF SPN": {
    "pathA": [
      "Samples of adverts placed",
      "LoI Template, RfP, RfQ, Bidding Documents SPN",
    ],
  },
  "SUBMISSION OF PROPOSALS": {
    "pathA": [
      "LOI from vendors ",
      "Filled bid proposal submission checklist",
    ],
  },
  "BID OPENING EXERCISE": {
    "pathA": [
      "Bid opening checklist",
      "Bid Opening Minutes",
    ],
  },
  "EVALUATION OF BID OPENING EXERCISE": {
    "pathA": [
      "Approved copy of the technical evaluation report",
      "Report of the financial bid",
      "Solicitation document",
      "Negotiation meeting agenda templates",
      "Minutes of Technical Negotiation Meeting",
      "Minutes of Financial Negotiation Meeting",
      "Minutes of Contract Agreement Negotiation",
      "Technical evaluation report",
      "Technical evaluation forwarding memo",
      "Financial evaluation report  ",
    ],
  },
  "CONTRACT RENEWAL / TERMINATION": {
    "pathA": [],
  },
}

exports.createProjectStages = async (stageNames = Object.Keys(this.stageNames)) => {
  for (const name in stageNames) {
    try {await ProjectStage.create({title: name})}
    catch (err) {console.log(`error: ${err}, during project stage creation`)}
  }
  return true
}
