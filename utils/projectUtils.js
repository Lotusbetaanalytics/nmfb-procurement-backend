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
  "SCOPE/TOR/TECHNICAL SPECIFICATION": [],
  "COST ESTIMATION": [],
  "SELECTION METHOD": [],
  "NO OBJECTION": [],
  "ISSUANCE OF SPN": [],
  "SUBMISSION OF PROPOSALS": [],
  "BID OPENING EXERCISE": [],
  "EVALUATION OF BID OPENING EXERCISE": [],
  "CONTRACT RENEWAL / TERMINATION": [],
}

exports.createProjectStages = async (stageNames = Object.Keys(this.stageNames)) => {
  for (const name in stageNames) {
    try {await ProjectStage.create({title: name})}
    catch (err) {console.log(`error: ${err}, during project stage creation`)}
  }
  return true
}
