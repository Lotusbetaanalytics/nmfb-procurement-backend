const asyncHandler = require("../middleware/async");
const Permission = require("../models/Permission");
const ProjectStage = require("../models/ProjectStage");
const ProjectType = require("../models/ProjectType");
const Role = require("../models/Role");
const {token} = require("./utils");
const {permissionTitles} = require("../utils/utilStore");
const ProjectInitiation = require("../models/ProjectInitiation");
const ProjectOnboarding = require("../models/ProjectOnboarding");
// const {populateProjectInitiation} = require("../controllers/projectInitiation");
// const {populateProjectOnboarding} = require("../controllers/projectOnboarding");
// const {populateProjectTask} = require("../controllers/projectTask");


exports.populateProjectInitiation = "contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy"
exports.populateProjectOnboarding = "project projectType contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer assignedBy assignedTo createdBy updatedBy"
exports.populateProjectTask = "project assignedBy assignedTo reassignedTo responsibleOfficer responsibleUnit createdBy"
exports.populateStaff = "team role photo"


exports.generateProjectId = async projectId => {
  try {
    const projectInitiation = await ProjectInitiation.findById(projectId).populate(this.populateProjectInitiation);
    const projectOnboarding = await ProjectOnboarding.findOne({project: projectId}).populate(this.populateProjectOnboarding);
    // const projectType = await ProjectType.findById(project.projectType);

    let projectTypeFirstLetter = projectOnboarding.projectType.title.slice(0, 1);

    let projectPathFirstLetter = "" 
    if (!projectOnboarding.projectType.requiredDocumentSetOne) {
      projectPathFirstLetter = "A"
    } else if (!projectOnboarding.projectType.requiredDocumentSetTwo) {
      projectPathFirstLetter = "B"
    }
    let projectCategoryFirstTwoLetters = projectOnboarding.projectCategory.title.slice(0, 2); 
    let budgetLineItemNumber = projectOnboarding.budgetLineItem.title 
    let serialNumber = token(5) //5-digit
    let fullIdPrefix = `${projectTypeFirstLetter}${projectPathFirstLetter}${projectCategoryFirstTwoLetters}${budgetLineItemNumber}`;
    const generatedId = `${projectTypeFirstLetter}${projectPathFirstLetter}${projectCategoryFirstTwoLetters}${budgetLineItemNumber}${serialNumber}`;
    console.log(generatedId)
    
    // Todo: check if a project already has this generated id, if yes, generated new id
    let projectWithGeneratedId = await ProjectInitiation.findOne({projectId: generatedId})
    while (projectWithGeneratedId) {
      serialNumber = token(5)
      generatedId = `${fullIdPrefix}${serialNumber}`
      projectWithGeneratedId = await ProjectInitiation.findOne({projectId: generatedId})
    }

    return generatedId;
  } catch (err) {
    console.log(err.message);
    return undefined;
  }
};


// exports.projectStages = {
//   "SCOPE/TOR/TECHNICAL SPECIFICATION": {
//     "pathA": [
//       "Signed ToR Checklist with Relevant/participating Bus",
//       "Initial Scope of work",
//     ],
//   },
//   "COST ESTIMATION": {
//     "pathA": [
//       "RfP/RfQ/Bidding Documents etc as applicable",
//     ],
//   },
//   "SELECTION METHOD": {
//     // TODO: Change to relevant documents
//     "pathA": [
//       "RfP/RfQ/Bidding Documents etc as applicable",
//     ],
//   },
//   "NO OBJECTION": {
//     "pathA": [
//       "Shortlist No-Objection & Prior Review (SNPR)Memo",
//       "SPN",
//       "Letter of intent",
//       "Letter of invitation",
//     ],
//     "pathB": [
//       "SPN",
//       "Solicitation docs",
//       "Inhouse estimate",
//     ]
//   },
//   "ISSUANCE OF SPN": {
//     "pathA": [
//       "Samples of adverts placed",
//       "LoI Template, RfP, RfQ, Bidding Documents SPN",
//     ],
//   },
//   "SUBMISSION OF PROPOSALS": {
//     "pathA": [
//       "LOI from vendors ",
//       "Filled bid proposal submission checklist",
//     ],
//   },
//   "BID OPENING EXERCISE": {
//     "pathA": [
//       "Bid opening checklist",
//       "Bid Opening Minutes",
//     ],
//   },
//   "EVALUATION OF BID OPENING EXERCISE": {
//     "pathA": [
//       "Approved copy of the technical evaluation report",
//       "Report of the financial bid",
//       "Solicitation document",
//       "Negotiation meeting agenda templates",
//       "Minutes of Technical Negotiation Meeting",
//       "Minutes of Financial Negotiation Meeting",
//       "Minutes of Contract Agreement Negotiation",
//       "Technical evaluation report",
//       "Technical evaluation forwarding memo",
//       "Financial evaluation report  ",
//     ],
//   },
//   "CONTRACT RENEWAL / TERMINATION": {
//     // "pathA": [],
//   },
// }


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


// TODO: Remove this
exports.createModelInstances = async (model = ProjectStage, object=this.projectStages) => {
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


// exports.deleteAllProjectStages = async () => {
//   allProjectStages = await ProjectStage.find()

//   for (const [key, stage] of Object.entries(allProjectStages))
//     await ProjectStage.findByIdAndDelete(stage._id)
//   console.log("All stages deleted")
// }

// exports.asyncHandler =  fn => async (...args) => {
//   try {
//     return await fn(...args)
//   } catch (err) {
//     console.log(`Error: ${err}`)
//     return false
//   }
// }


exports.createModelInstanceWithList = async (model = Permission, list = permissionTitles) => {
  for (const item of list) {
    console.log(item)
    const payload = {title: item} 
    try {await model.create(payload)}
    catch (err) {console.log(`error: ${err}, during ${model} creation`)}
  }
  console.log(`All model instances created successfully.`)
}


// // TODO: Test this, likely to have errors
// exports.createModelInstances = async (model = ProjectStage, object = this.projectStages) => {
//   if (typeof object != "object") {
//     console.log(`type of parameter is not object`)
//     return false
//   }
//   try {
//     const instances = object
//     for (const [key, instance] of Object.entries(instances)) {
//       console.log(`key, instance:${key}, ${instance}`)
//       const payload = {}

//       for (const [index, item] of Object.entries(instance)) {
//         console.log(`index, item:${key}, ${instance}`)
//         payload[index] = item
//       }
//       try {await model.create(payload)}
//       catch (err) {console.log(`error: ${err}, during model creation`)}
//     }
//   } catch (err) {
//     console.log(`Error creating model instances: ${err}`)
//   }
// }


// exports.deleteAllModelInstances = async (model = ProjectStage) => {
//   const instances = await model.find()
//   console.log(instances)
//   try {
//     // let item;
//     for (const [key, instance] of Object.entries(instances)) {
//       // var item = await model.findById(instance._id)
//       // await item.save()
//       await model.findByIdAndDelete(instance._id)
//     }
//     console.log(`All model instances deleted`)
//   } catch (err) {
//     console.log(`Error deleting model instances: ${err}`)
//   }
// }


exports.addPermissionsToRole = async (roleID, permissions) => {
  let permissionIDs = [];
  if (!permissions) {
    permissions = await Permission.find()
    for (const [key, permission] of Object.entries(permissions)) {
      console.log(permission.title + "" + permissions._id)
      permissionIDs.push(permission._id)
    }
    permissions = permissionIDs
  } 

  try{
    const updatedRole = await Role.findById(roleID)
    updatedRole.permissions = permissions
    await updatedRole.save()
    console.log(updatedRole)
    console.log("All roles updated with permissions")
  } catch (err) {
    console.log(`error updating role: ${err}`)
  }
}


// exports.rolePermissions = async(roleID, permissions) => {
//   let permissionIDs = [];
//   if (!permissions) {
//     permissions = await Permission.find()
//     for (const [key, permission] of Object.entries(permissions)) {
//       console.log(permission._id)
//       permissionIDs.push(permission._id)
//     }
//     permissions = permissionIDs
//   } 

//   const role = await Role.findById(roleID)

// }


exports.setProjectOnboardingStatus = async projectOnboarding => {
  if (projectOnboarding.isApproved && projectOnboarding.status != "Completed" && projectOnboarding.status != "Started" ) {
    projectOnboarding.status = "Started";
  } else if (projectOnboarding.isApproved && projectOnboarding.status != "Started") {
    projectOnboarding.status = "Completed";
  } else if (projectOnboardingprojectOnboarding.status == "Terminated") {
    projectOnboarding.isApproved = false;
  }
  await projectOnboarding.save();
}


exports.setProjectOnboardingApprovalStatus = async projectOnboarding => {
  if (projectOnboarding.isApproved && projectOnboarding.status == "Completed") {
    const projectInitiation = await ProjectInitiation.findById(projectOnboarding.project);
    projectInitiation.status = "Approved";
    projectInitiation.isApproved = true;
    projectInitiation.isOnboarded = true;
    await projectInitiation.save();
  }
}