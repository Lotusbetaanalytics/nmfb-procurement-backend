const asyncHandler = require("../middleware/async");
const ProjectInitiation = require("../models/ProjectInitiation");
const ProjectStage = require("../models/ProjectStage");
const ProjectTask = require("../models/ProjectTask");
const SupportingDocuments = require("../models/SupportingDocuments");
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse");
const {uploadProjectDocuments, uploadDocument} = require("../utils/fileUtils");
const {addUserDetails, checkInstance} = require("../utils/queryUtils");
const {
  projectAssignmentEmail,
  projectInitiationEmail, 
  projectInitiationUpdateEmail,
  projectCostEstimationEmail,
} = require("../utils/projectEmail");
const {generateProjectId} = require("../utils/projectUtils")
const titleCaps = require("../utils/titleCaps")


exports.populateProjectInitiation = "contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy"


// @desc    Create ProjectInitiation
// @route  POST /api/v1/projectInitiation
// @access   Private
exports.createProjectInitiation = asyncHandler(async (req, res, next) => {
  // check for existing project initiation
  await this.checkProjectInitiation(req, res, {projectTitle: req.body.projectTitle})

  // add user details to req.body
  addUserDetails(req)

  // check user role and fill relevant field
  if (req.user.role.title == "Head of Procurement") {
    req.body.headOfProcurement = req.user._id;
  } else if (req.user.role.title == "Admin" || req.user.role.title == "Frontdesk") {
    req.body.frontDeskOfficer = req.user._id;
  } else if (req.user.role.title == "Super Admin") {
    // do nothing
  } else {
    return new ErrorResponseJSON(res, `You are not authorized to initiate projects!. Role is ${req.user.role.title}`, 404);
  }

  // create project initiation
  const projectInitiation = await ProjectInitiation.create(req.body);
  if (!projectInitiation) {
    return new ErrorResponseJSON(res, "ProjectInitiation not created!", 404);
  }

  /**
  // DONE: Generate project ID: requires project to be onboarded first
  projectInitiation.projectId = await generateProjectId(projectInitiation)
  console.log(`projectInitiation.projectId: ${projectInitiation.projectId}`)
  await projectInitiation.save()
    */

  /**
   * DONE:
   * Post-conditions:
   * • The PPC portal shall send successful initiation project email notification to the head of procurement
   * • The PPC portal shall send a new project email notification to the project desk officer
   * • The system shall send email notification to the front office /admin to upload or review documents.
   * */
  // send project initiation mail
  await projectInitiationEmail(projectInitiation);

  // upload files
  const documentLinks = await uploadDocument(req, projectInitiation, req.files, projectInitiation.projectTitle)
  projectInitiation.files = projectInitiation.files || []
  projectInitiation.files = projectInitiation.files.concat(documentLinks)
  await projectInitiation.save()

  return new SuccessResponseJSON(res, projectInitiation)
});


// @desc    Get all ProjectInitiations
// @route  GET /api/v1/projectInitiation
// @access   Public
exports.getAllProjectInitiations = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});


// @desc    Get ProjectInitiation
// @route  GET /api/v1/projectInitiation/:id
// @access   Private
exports.getProjectInitiation = asyncHandler(async (req, res, next) => {
  const projectInitiation = await this.checkProjectInitiation(req, res)
  return new SuccessResponseJSON(res, projectInitiation)
});


// @desc    Update ProjectInitiation
// @route  PATCH /api/v1/projectInitiation/:id
// @access   Private
exports.updateProjectInitiation = asyncHandler(async (req, res, next) => {
  // add user details to req.body
  addUserDetails(req, true)

  const projectInitiation = await ProjectInitiation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!projectInitiation) {
    return new ErrorResponseJSON(res, "ProjectInitiation not updated!", 400);
  }

  // DONE: Generate project ID: requires project to be onboarded first
  // TODO: Fix naming bug in project ID
  if (!projectInitiation.projectId)
    projectInitiation.projectId = await generateProjectId(projectInitiation);
    await projectInitiation.save()

  /**
   * DONE:
   * Post-conditions (Depending on the ProjectInitiation status):
   * • The PPC portal shall send successful update of project email notification to the head of procurement
   * • The PPC portal shall send a update project email notification to the project desk officer
   * • The system shall send email notification to the front office /admin to upload or review documents.
   * */
  // send project initiation mail
  await projectInitiationEmail(projectInitiation, true);

  // upload files
  const documentLinks = await uploadDocument(req, projectInitiation, req.files, projectInitiation.projectTitle)
  projectInitiation.files = projectInitiation.files || []
  projectInitiation.files = projectInitiation.files.concat(documentLinks)
  await projectInitiation.save()

  return new SuccessResponseJSON(res, projectInitiation)
});


// @desc    Delete ProjectInitiation
// @route  DELETE /api/v1/projectInitiation
// @access   Private
exports.deleteProjectInitiation = asyncHandler(async (req, res, next) => {
  const projectInitiation = await ProjectInitiation.findByIdAndDelete(req.params.id);
  if (!projectInitiation) {
    return new ErrorResponseJSON(res, "ProjectInitiation not found!", 404);
  }
  return new SuccessResponseJSON(res, projectInitiation)
});


// @desc    Approve ProjectInitiation
// @route  GET /api/v1/projectInitiation/:id/approve
// @access   Private
exports.approveProjectInitiation = asyncHandler(async (req, res, next) => {
  // check for existing project initiation
  const projectInitiation = await this.checkProjectInitiation(req, res)

  // onboard the project and set initiation status to approved
  projectInitiation.status = "Approved";
  projectInitiation.isOnboarded = true;
  projectInitiation.save();

  return new SuccessResponseJSON(res, projectInitiation)
});


// @desc    Decline ProjectInitiation
// @route  GET /api/v1/projectInitiation/:id/decline
// @access   Private
exports.declineProjectInitiation = asyncHandler(async (req, res, next) => {
  // check for existing project initiation
  const projectInitiation = await this.checkProjectInitiation(req, res)

  // set project initiation status to declined
  projectInitiation.status = "Declined";
  projectInitiation.save();

  return new SuccessResponseJSON(res, projectInitiation)
});


// TODO: Confirm this code block is used
// @desc    Assign Project to Responsible officer
// @route  PATCH /api/v1/projectInitiation/:id/assign
// @access   Private
exports.assignProject = asyncHandler(async (req, res, next) => {
  // check for existing project initiation
  await this.checkProjectInitiation(req, res)

  const projectInitiation = await ProjectInitiation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!projectInitiation) {
    return new ErrorResponseJSON(res, "ProjectInitiation not updated!", 400);
  }
  // send project assignment email
  await projectAssignmentEmail(projectInitiation);

  return new SuccessResponseJSON(res, projectInitiation)
});


// DONE: Add update status endpoints
// @desc    Update ProjectInitiation Status
// @route  PATCH /api/v1/projectInitiation/:id/status
// @access   Private
exports.updateProjectInitiationStatus = asyncHandler(async (req, res, next) => {
  // add user details to req.body
  await addUserDetails(req, true)

  const {status} = req.body

  const projectInitiation = await ProjectInitiation.findByIdAndUpdate(req.params.id, {status}, {
    new: true,
    runValidators: true,
  });
  if (!projectInitiation) {
    return new ErrorResponseJSON(res, "ProjectInitiation not updated!", 400);
  }

  /**
   * DONE:
   * Post-conditions (Depending on the ProjectInitiation status):
   * • The PPC portal shall send successful update of project email notification to the head of procurement
   * • The PPC portal shall send a update project email notification to the project desk officer
   * • The system shall send email notification to the front office /admin to upload or review documents.
   * */
  // send project initiation mail
  await projectInitiationEmail(projectInitiation, true);

  return new SuccessResponseJSON(res, projectInitiation)
});


// TODO: Confirm this is used
// @desc    Upload ProjectInitiation Documents
// @route  PATCH /api/v1/projectInitiation/:id/upload
// @access   Private
exports.uploadProjectInitiationDocuments = asyncHandler(async (req, res, next) => {
  // check for files in request
  if (!req.files) return new ErrorResponseJSON(res, "No files provided!", 400);

  // check for existing project initiation
  const projectInitiation = await this.checkProjectInitiation(req, res)

  // upload files
  const documentLinks = await uploadDocument(req, projectInitiation, req.files, projectInitiation.projectTitle)
  projectInitiation.files = projectInitiation.files || []
  projectInitiation.files = projectInitiation.files.concat(documentLinks)
  await projectInitiation.save()

  return new SuccessResponseJSON(res, projectInitiation)
});


// NOTE: Endpoints for uploading documents (supporting documents)

// @desc    Upload ProjectInitiation TechnicalSpecification Documents
// @route  POST /api/v1/projectInitiation/:id/technicalSpecification
// @access   Private
exports.uploadProjectInitiationTechnicalSpecificationDocuments = asyncHandler(async (req, res, next) => {
  // TODO: Confirm title
  // const title = "SCOPE/TOR/TECHNICAL SPECIFICATION"
  const title = "SCOPE OR TECHNICAL SPECIFICATION"
  const {projectInitiation, documents} = await this.uploadProjectSupportingDocuments(req, res, next, title)

  /**
   * TODO:
   * PPC portal sends email notification notifying the PDO to take action on the ‘selection method ‘ stage
   */

  await projectTechnicalSpecificationEmail(projectInitiation)

  return new SuccessResponseJSON(res, projectInitiation)
});


// @desc    Upload ProjectInitiation CostEstimation Documents
// @route  POST /api/v1/projectInitiation/:id/costEstimation
// @access   Private
exports.uploadProjectInitiationCostEstimationDocuments = asyncHandler(async (req, res, next) => {
  const title = "COST ESTIMATION"
  const {projectInitiation, documents} = await this.uploadProjectSupportingDocuments(req, res, next, title)

  /**
   * TODO:
   * PPC portal sends email notification notifying the PDO to take action on the ‘selection method ‘ stage
   */

  await projectCostEstimationEmail(projectInitiation)

  return new SuccessResponseJSON(res, projectInitiation)
});


// @desc    Upload ProjectInitiation SelectionMethod Documents
// @route  POST /api/v1/projectInitiation/:id/selectionMethod
// @access   Private
exports.uploadProjectInitiationSelectionMethodDocuments = asyncHandler(async (req, res, next) => {
  const title = "SELECTION METHOD"
  const {projectInitiation, documents} = await this.uploadProjectSupportingDocuments(req, res, next, title)

  /**
   * TODO:
   * PPC portal sends email notification notifying the PDO to take action on the ‘selection method ‘ stage
   */

  await projectSelectionMethodEmail(projectInitiation)

  return new SuccessResponseJSON(res, projectInitiation)
});


// @desc    Upload ProjectInitiation NoObjection Documents
// @route  POST /api/v1/projectInitiation/:id/noObjection
// @access   Private
exports.uploadProjectInitiationNoObjectionDocuments = asyncHandler(async (req, res, next) => {
  const title = "NO OBJECTION"
  const {projectInitiation, documents} = await this.uploadProjectSupportingDocuments(req, res, next, title)

  /**
   * TODO:
   * PPC portal sends email notification notifying the PDO to take action on the ‘selection method ‘ stage
   */

  await projectNoObjectionEmail(projectInitiation)

  return new SuccessResponseJSON(res, projectInitiation)
});


// @desc    Upload ProjectInitiation IssuanceOfSPN Documents
// @route  POST /api/v1/projectInitiation/:id/issuanceOfSPN
// @access   Private
exports.uploadProjectInitiationIssuanceOfSPNDocuments = asyncHandler(async (req, res, next) => {
  const title = "ISSUANCE OF SPN"
  const {projectInitiation, documents} = await this.uploadProjectSupportingDocuments(req, res, next, title)

  /**
   * TODO:
   * PPC portal sends email notification notifying the PDO to take action on the ‘selection method ‘ stage
   */

  await projectIssuanceOfSPNEmail(projectInitiation)

  return new SuccessResponseJSON(res, projectInitiation)
});


// @desc    Upload ProjectInitiation SubmissionOfProposals Documents
// @route  POST /api/v1/projectInitiation/:id/submissionOfProposals
// @access   Private
exports.uploadProjectInitiationSubmissionOfProposalsDocuments = asyncHandler(async (req, res, next) => {
  const title = "SUBMISSION OF PROPOSALS"
  const {projectInitiation, documents} = await this.uploadProjectSupportingDocuments(req, res, next, title)

  /**
   * TODO:
   * PPC portal sends email notification notifying the PDO to take action on the ‘selection method ‘ stage
   */

  await projectSubmissionOfProposalsEmail(projectInitiation)

  return new SuccessResponseJSON(res, projectInitiation)
});


// @desc    Upload ProjectInitiation BidOpeningExercise Documents
// @route  POST /api/v1/projectInitiation/:id/bidOpeningExercise
// @access   Private
exports.uploadProjectInitiationBidOpeningExerciseDocuments = asyncHandler(async (req, res, next) => {
  const title = "BID OPENING EXERCISE"
  const {projectInitiation, documents} = await this.uploadProjectSupportingDocuments(req, res, next, title)

  /**
   * TODO:
   * PPC portal sends email notification notifying the PDO to take action on the ‘selection method ‘ stage
   */

  await projectBidOpeningExerciseEmail(projectInitiation)

  return new SuccessResponseJSON(res, projectInitiation)
});


// @desc    Upload ProjectInitiation BidEvaluation Documents
// @route  POST /api/v1/projectInitiation/:id/bidEvaluation
// @access   Private
exports.uploadProjectInitiationBidEvaluationDocuments = asyncHandler(async (req, res, next) => {
  // TODO: Confirm title
  // const title = "EVALUATION OF BID OPENING EXERCISE"
  const title = "BID EVALUATION"
  const {projectInitiation, documents} = await this.uploadProjectSupportingDocuments(req, res, next, title)

  /**
   * TODO:
   * PPC portal sends email notification notifying the PDO to take action on the ‘selection method ‘ stage
   */

  await projectBidEvaluationEmail(projectInitiation)

  return new SuccessResponseJSON(res, projectInitiation)
});


// TODO: Confirm this is used
// @desc    Get ProjectInitiation Tasks
// @route  GET /api/v1/projectInitiation/:id/tasks
// @access   Private
exports.getProjectInitiationTasks = asyncHandler(async (req, res, next) => {
    const projectTasks = await ProjectTask.find({project: req.params.id});
    return new SuccessResponseJSON(res, projectTasks)
});


exports.uploadProjectSupportingDocuments = asyncHandler(async (req, res, next, title = "BID OPENING EXERCISE") => {
  /**
   * @summary
   *  upload project supporting documents using req.params.id (project initiation id) and title 
   *  save uploaded files urls to projectInitiation and supportingDocument instances
   * 
   * @param title - string for getting project stage, folder name and formatting error messages
   * 
   * @returns object containing projectInitiation and supportingDocument instances
   */
  const {files} = req
  if (!files) return new ErrorResponseJSON(res, "No files provided!", 400);

  const projectInitiation = await this.checkProjectInitiation(req, res)

  const projectStage = await ProjectStage.findOne({title: title})

  // const payload = {
  //   employeeName: req.user.fullname,
  //   employeeEmail: req.user.email,
  //   project: projectInitiation._id,
  //   projectTitle: projectInitiation.projectTitle,
  //   projectStage: projectStage,
  //   documentType: req.body.documentType,
  //   documentName: req.body.documentName,
  //   files: req.body.files,
  //   memo: req.body.memo,
  //   description: req.body.description,

  // }

  // add user details to req.body
  addUserDetails(req, true)
  
  req.body.project = projectInitiation._id
  req.body.projectTitle = projectInitiation.projectTitle
  req.body.projectStage = projectStage._id

  // create supporting documents instance
  const documents = await SupportingDocuments.create(req.body)
  if (!documents) return new ErrorResponseJSON(res, `${title.toLowerCase()} Documents not uploaded!`, 400 );
  // create folder path
  const folderPath = `${projectInitiation.projectTitle}/${titleCaps(title)}`
  // upload files
  const documentLinks = await uploadDocument(req, projectInitiation, files, folderPath)
  // save uploaded file url(s) to project initiation instance
  projectInitiation.files = projectInitiation.files || []
  projectInitiation.files = projectInitiation.files.concat(documentLinks)
  await projectInitiation.save()

  // save uploaded file url(s) to supporting document instance
  documents.files = documents.files || []
  documents.files = documents.files.concat(documentLinks)
  await documents.save()

  return {projectInitiation, documents}
});


exports.checkProjectInitiation = async (req, res, query = {}) => {
  /**
   * @summary
   *  check if Project Initiation instance exists, check if req.params.id exists and perform logic based on that
   * 
   * @throws `Project Initiation not Found!`, 404
   * @throws `This Project Initiation already exists, update it instead!`, 400
   * 
   * @returns Project Initiation instance
   */
  let projectInitiation = await checkInstance(
    req, res, ProjectInitiation, this.populateProjectInitiation, query, "Project Initiation"
  )
  return projectInitiation
}
