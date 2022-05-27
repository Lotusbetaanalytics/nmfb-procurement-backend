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

exports.projectStages = {
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
    // "pathA": [],
  },
}

exports.createProjectStages = async (projectStages = Object.entries(this.projectStages)) => {
  // for (const name of projectStages) {
  for (const [key, name] of projectStages) {
    // console.log(`key: ${key}`)
    // // console.log(`name: ${name}`) // [object Object]
    // console.log(`name["pathA"]: ${name.pathA}`)
    // console.log(`name["pathB"]: ${name.pathB}`)

    const payload = {title: key}
    if (name.pathA) payload.requiredDocuments = name.pathA
    if (name.pathB) payload.alternativeDocuments = name.pathB

    // for (const [key, item] of Object.entries(payload)) 
    //   console.log(`payload.${key}: ${item}`)

    try {await ProjectStage.create(payload)}
    catch (err) {console.log(`error: ${err}, during project stage creation`)}
  }
  console.log("All stages created")
  return true
}

exports.createModelInstances = async (model=ProjectStage, object=this.projectStages) => {
  if (typeof object != "object") {
    console.log(`type of parameter is not object`)
    return false
  }
  try {
    const instances = object
    for (const [key, instance] of Object.entries(instances)) {
      console.log(`key, instance:${key}, ${instance}`)
      const payload = {}

      for (const [index, item] of Object.entries(instance)) {
        console.log(`index, item:${key}, ${instance}`)
        payload[index] = item
      }
      try {await model.create(payload)}
      catch (err) {console.log(`error: ${err}, during ${model} creation`)}
    }
  } catch (err) {
    console.log(`Error creating ${model} instances: ${err}`)
  }
}

exports.deleteAllProjectStages = async () => {
  allProjectStages = await ProjectStage.find()

  for (const [key, stage] of Object.entries(allProjectStages))
    await ProjectStage.findByIdAndDelete(stage._id)
  console.log("All stages deleted")
}

// exports.asyncHandler =  fn => async (...args) => {
//   try {
//     return await fn(...args)
//   } catch (err) {
//     console.log(`Error: ${err}`)
//     return false
//   }
// }

// TODO: Test this, likely to have errors
exports.createModelInstances = async (model=ProjectStage, object=this.projectStages) => {
  if (typeof object != "object") {
    console.log(`type of parameter is not object`)
    return false
  }
  try {
    const instances = object
    for (const [key, instance] of Object.entries(instances)) {
      console.log(`key, instance:${key}, ${instance}`)
      const payload = {}

      for (const [index, item] of Object.entries(instance)) {
        console.log(`index, item:${key}, ${instance}`)
        payload[index] = item
      }
      try {await model.create(payload)}
      catch (err) {console.log(`error: ${err}, during model creation`)}
    }
  } catch (err) {
    console.log(`Error creating model instances: ${err}`)
  }
}

exports.deleteAllModelInstances = async (model=ProjectStage) => {
  const instances = await model.find()
  console.log(instances)
  try {
    // let item;
    for (const [key, instance] of Object.entries(instances)) {
      // var item = await model.findById(instance._id)
      // await item.save()
      await model.findByIdAndDelete(instance._id)
    }
    console.log(`All model instances deleted`)
  } catch (err) {
    console.log(`Error deleting model instances: ${err}`)
  }
}
