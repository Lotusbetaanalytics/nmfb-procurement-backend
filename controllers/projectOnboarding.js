const asyncHandler = require("../middleware/async");
const ProjectInitiation = require("../models/ProjectInitiation");
const ProjectOnboarding = require("../models/ProjectOnboarding");
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse");
const { uploadProjectDocuments } = require("../utils/fileUtils");
const {addUserDetails, checkInstance} = require("../utils/queryUtils");
const {
  projectOnboardingEmail,
  // projectOnboardingUpdateEmail,
  projectAssignmentEmail,
} = require("../utils/projectEmail");
// const { createProjectStages, deleteAllProjectStages, deleteAllModelInstances, createModelInstanceWithList, addPermissionsToRole } = require("../utils/projectUtils");
const {generateProjectId, setProjectOnboardingStatus, setProjectOnboardingApprovalStatus} = require("../utils/projectUtils");


exports.populateProjectOnboarding = "project projectType contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer assignedBy assignedTo createdBy updatedBy"


// @desc    Create ProjectOnboarding
// @route  POST /api/v1/projectOnboarding
// @access   Private
exports.createProjectOnboarding = asyncHandler(async (req, res, next) => {
  // check for existing project onboarding instance
  await this.checkProjectOnboarding(req, res, {projectTitle: req.body.projectTitle})

  // add user details to req.body
  addUserDetails(req)

  const projectOnboarding = await ProjectOnboarding.create(req.body);
  if (!projectOnboarding) {
    return new ErrorResponseJSON(res, "ProjectOnboarding not created!", 404);
  }

  await setProjectOnboardingStatus(projectOnboarding)
  await setProjectOnboardingApprovalStatus(projectOnboarding)

  const projectInitiation = await ProjectInitiation.findById(projectOnboarding.project);
  if (!projectInitiation.projectId) {
    projectInitiation.projectId = await generateProjectId(projectInitiation._id)
  }
  /**
   * TODO:
   * Post-conditions:
   * • If the selected contract type is ‘existing contract’ the system shall send an email notification to the PDO to specify evaluation officers and save the project to the ‘renewal list’
   * • If the selected contract type is ‘new’ the system shall send an email notification to the PDO with a link to scope the project and save the project to the ‘New project list’
   */
  await projectOnboardingEmail(projectOnboarding);

  // /**
  //  * TODO:
  //  * project assignment email
  //  */
  // if (req.body.responsibleOfficer || projectOnboarding.responsibleOfficer)
  //   await projectAssignmentEmail(projectOnboarding);

  return new SuccessResponseJSON(res, projectOnboarding)
});


// @desc    Get all ProjectOnboardings
// @route  GET /api/v1/projectOnboarding
// @access   Public
exports.getAllProjectOnboardings = asyncHandler(async (req, res, next) => {
  // await createProjectStages()
  // await deleteAllProjectStages()
  // await deleteAllModelInstances()
  // await createModelInstanceWithList()
  // const frontDeskOfficerPermissions = [
  //   "6290ba53c0ab37daf3a5120f",
  //   "6290ba53c0ab37daf3a51211",
  //   "6290ba53c0ab37daf3a51213",
  //   "6290ba54c0ab37daf3a51215",
  //   "6290ba54c0ab37daf3a51217",
  //   "6290ba54c0ab37daf3a51219",
  // ]
  // await addPermissionsToRole()
  return res.status(200).json(res.advancedResults);
});


// @desc    Get ProjectOnboarding
// @route  GET /api/v1/projectOnboarding/:id
// @access   Private
exports.getProjectOnboarding = asyncHandler(async (req, res, next) => {
  const projectOnboarding = await this.checkProjectOnboarding(req, res)
  return new SuccessResponseJSON(res, projectOnboarding)
});


// @desc    Update ProjectOnboarding
// @route  PATCH /api/v1/projectOnboarding/:id
// @access   Private
exports.updateProjectOnboarding = asyncHandler(async (req, res, next) => {
  // add user details to req.body
  addUserDetails(req, true)

  const projectOnboarding = await ProjectOnboarding.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!projectOnboarding) {
    return new ErrorResponseJSON(res, "ProjectOnboarding not updated!", 400);
  }

  await setProjectOnboardingStatus(projectOnboarding)
  await setProjectOnboardingApprovalStatus(projectOnboarding)

  /**
   * TODO:
   * Post-conditions:
   * • If the selected contract type is ‘existing contract’ the system shall send an email notification to the PDO to specify evaluation officers and save the project to the ‘renewal list’
   * • If the selected contract type is ‘new’ the system shall send an email notification to the PDO with a link to scope the project and save the project to the ‘New project list’
   */
  await projectOnboardingEmail(projectOnboarding, true);

  // /**
  //  * TODO:
  //  * project assignment email
  //  */
  // if (req.body.responsibleOfficer) await projectAssignmentEmail(projectOnboarding);

  return new SuccessResponseJSON(res, projectOnboarding)
});


// @desc    Delete ProjectOnboarding
// @route  DELETE /api/v1/projectOnboarding
// @access   Private
exports.deleteProjectOnboarding = asyncHandler(async (req, res, next) => {
  const projectOnboarding = await ProjectOnboarding.findByIdAndDelete(req.params.id);
  if (!projectOnboarding) {
    return new ErrorResponseJSON(res, "ProjectOnboarding not found!", 404);
  }
  return new SuccessResponseJSON(res, projectOnboarding)
});


/**
 *  TODO: Replace these endpoints with the advanced results endpoint
// @desc    Get all Started ProjectOnboardings
// @route  GET /api/v1/projectOnboarding/started
// @access   Public
exports.getAllStartedProjectOnboardings = asyncHandler(async (req, res, next) => {
    const startedProjectOnboarding = await ProjectOnboarding.find({status: "Started"}).populate(
      this.populateProjectOnboarding
    );

    // if (startedProjectOnboarding.length < 1) {
    //   return new ErrorResponseJSON(res, "Started ProjectOnboardings not found!", 404);
    // }
    res.status(200).json({
      success: true,
      data: startedProjectOnboarding,
    });
});


// @desc    Get all Terminated ProjectOnboardings
// @route  GET /api/v1/projectOnboarding/terminated
// @access   Public
exports.getAllTerminatedProjectOnboardings = asyncHandler(async (req, res, next) => {
    const terminatedProjectOnboarding = await ProjectOnboarding.find({status: "Terminated"}).populate(
      this.populateProjectOnboarding
    );

    // if (terminatedProjectOnboarding.length < 1) {
    //   return new ErrorResponseJSON(res, "Terminated ProjectOnboardings not found!", 404);
    // }
    res.status(200).json({
      success: true,
      data: terminatedProjectOnboarding,
    });
});


// @desc    Get all Pending ProjectOnboardings
// @route  GET /api/v1/projectOnboarding/pending
// @access   Public
exports.getAllPendingProjectOnboardings = asyncHandler(async (req, res, next) => {
    const pendingProjectOnboarding = await ProjectOnboarding.find({status: "Pending"}).populate(
      this.populateProjectOnboarding
    );

    // if (pendingProjectOnboarding.length < 1) {
    //   return new ErrorResponseJSON(res, "Pending ProjectOnboardings not found!", 404);
    // }
    res.status(200).json({
      success: true,
      data: pendingProjectOnboarding,
    });
});


// @desc    Get all Completed ProjectOnboardings
// @route  GET /api/v1/projectOnboarding/completed
// @access   Public
exports.getAllCompletedProjectOnboardings = asyncHandler(async (req, res, next) => {
    const completedProjectOnboarding = await ProjectOnboarding.find({status: "Completed"}).populate(
      this.populateProjectOnboarding
    );

    // if (completedProjectOnboarding.length < 1) {
    //   return new ErrorResponseJSON(res, "Completed ProjectOnboardings not found!", 404);
    // }
    res.status(200).json({
      success: true,
      data: completedProjectOnboarding,
    });
});
 */


// TODO: Add terminate project onboarding endpoint
// @desc    Terminate ProjectOnboarding
// @route  GET /api/v1/projectOnboarding/:id/terminate
// @access   Private
exports.terminateProjectOnboarding = asyncHandler(async (req, res, next) => {
  const projectOnboarding = await this.checkProjectOnboarding(req, res)
  projectOnboarding.status = "Terminated";
  projectOnboarding.save();

  return new SuccessResponseJSON(res, projectOnboarding)
});


// TODO: Add update status endpoints
// @desc    Update ProjectOnboarding Status
// @route  PATCH /api/v1/projectOnboarding/:id/status
// @access   Private
exports.updateProjectOnboardingStatus = asyncHandler(async (req, res, next) => {
  // add user details to req.body
  addUserDetails(req, true)

  const {status} = req.body;

  const projectOnboarding = await ProjectOnboarding.findByIdAndUpdate(req.params.id, {status}, {
    new: true,
    runValidators: true,
  });
  if (!projectOnboarding) {
    return new ErrorResponseJSON(res, "ProjectOnboarding not updated!", 400);
  }

  /**
   * TODO:
   * Post-conditions (Depending on the ProjectOnboarding status):
   * • The PPC portal shall send successful update of project email notification to the head of procurement
   * • The PPC portal shall send a update project email notification to the project desk officer
   * • The system shall send email notification to the front office /admin to upload or review documents.
   * */
  await projectOnboardingEmail(projectOnboarding, true);

  return new SuccessResponseJSON(res, projectOnboarding)
});


// TODO: add endpoint for uploading supporting documents
// @desc    Upload ProjectOnboarding Documents
// @route  PATCH /api/v1/projectOnboarding/:id/upload
// @access   Private
exports.uploadProjectOnboardingDocuments = asyncHandler(async (req, res, next) => {
  const {files} = req
  if (!files) return new ErrorResponseJSON(res, "No files provided!", 400);

  // add user details to req.body
  addUserDetails(req, true)

  const projectOnboarding = await this.checkProjectOnboarding(req, res)

  const projectInitiation = await ProjectInitiation.findById(projectOnboarding.project)

  // upload files
  const documentLinks = await uploadDocument(req, projectInitiation, files, folderPath)
  // save uploaded file url(s) to project initiation instance
  projectInitiation.files = projectInitiation.files || []
  projectInitiation.files = projectInitiation.files.concat(documentLinks)
  await projectInitiation.save()

  return new SuccessResponseJSON(res, projectOnboarding)
});


exports.checkProjectOnboarding = async (req, res, query = {}) => {
  /**
   * @summary
   *  check if Project Onboarding instance exists, check if req.params.id exists and perform logic based on that
   * 
   * @throws `Project Onboarding not Found!`, 404
   * @throws `This Project Onboarding already exists, update it instead!`, 400
   * 
   * @returns Project Onboarding instance
   */
  let projectOnboarding = await checkInstance(
    req, res, ProjectOnboarding, this.populateProjectOnboarding, query, "Project Onboarding"
  )
  return projectOnboarding
}
