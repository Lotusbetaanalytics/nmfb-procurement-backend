const asyncHandler = require("../middleware/async");
const ProjectInitiation = require("../models/ProjectInitiation");
const ProjectOnboarding = require("../models/ProjectOnboarding");
const {ErrorResponseJSON} = require("../utils/errorResponse");
const { uploadProjectDocuments } = require("../utils/fileUtils");
const {
  projectOnboardingEmail,
  projectOnboardingUpdateEmail,
  projectAssignmentEmail,
} = require("../utils/projectEmail");


exports.populateProjectOnboardingDetails = "project projectType contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer assignedBy assignedTo createdBy updatedBy"



// @desc    Create ProjectOnboarding
// @route  POST /api/v1/projectOnboarding
// @access   Private
exports.createProjectOnboarding = asyncHandler(async (req, res, next) => {
  try {
    const existingProjectOnboarding = await ProjectOnboarding.find({projectTitle: req.body.projectTitle}).populate(
      this.populateProjectOnboardingDetails
    );

    if (existingProjectOnboarding.length > 0) {
      return new ErrorResponseJSON(res, "This projectOnboarding already exists, update it instead!", 400);
    }

    req.body.name = req.user.fullname;
    req.body.email = req.user.email;
    req.body.createdBy = req.user._id;

    const projectOnboarding = await ProjectOnboarding.create(req.body);

    if (!projectOnboarding) {
      return new ErrorResponseJSON(res, "ProjectOnboarding not created!", 404);
    }

    if (
      projectOnboarding.isApproved &&
      projectOnboarding.status != "Completed" &&
      projectOnboarding.status != "Started"
    ) {
      projectOnboarding.status = "Started";
    } else if (projectOnboarding.isApproved && projectOnboarding.status != "Started") {
      projectOnboarding.status = "Completed";
    } else if (projectOnboardingprojectOnboarding.status == "Terminated") {
      projectOnboarding.isApproved = false;
    }
    await projectOnboarding.save();

    if (projectOnboarding.isApproved && projectOnboarding.status == "Completed") {
      const projectInitiation = await ProjectInitiation.findById(projectOnboarding.project);
      projectInitiation.status = "Approved";
      projectInitiation.isApproved = true;
      projectInitiation.isOnboarded = true;
      await projectInitiation.save();
    }

    /**
     * TODO:
     * Post-conditions:
     * • If the selected contract type is ‘existing contract’ the system shall send an email notification to the PDO to specify evaluation officers and save the project to the ‘renewal list’
     * • If the selected contract type is ‘new’ the system shall send an email notification to the PDO with a link to scope the project and save the project to the ‘New project list’
     */
    await projectOnboardingEmail(projectOnboarding, req, res, next);

    // /**
    //  * TODO:
    //  * project assignment email
    //  */
    // if (req.body.responsibleOfficer || projectOnboarding.responsibleOfficer)
    //   await projectAssignmentEmail(projectOnboarding);

    res.status(200).json({
      success: true,
      data: projectOnboarding,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Get all ProjectOnboardings
// @route  GET /api/v1/projectOnboarding
// @access   Public
exports.getAllProjectOnboardings = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});


// @desc    Get ProjectOnboarding
// @route  GET /api/v1/projectOnboarding/:id
// @access   Private
exports.getProjectOnboarding = asyncHandler(async (req, res, next) => {
  try {
    const projectOnboarding = await ProjectOnboarding.findById(req.params.id).populate(
      this.populateProjectOnboardingDetails
    );

    if (!projectOnboarding) {
      return new ErrorResponseJSON(res, "ProjectOnboarding not found!", 404);
    }
    res.status(200).json({
      success: true,
      data: projectOnboarding,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Update ProjectOnboarding
// @route  PATCH /api/v1/projectOnboarding/:id
// @access   Private
exports.updateProjectOnboarding = asyncHandler(async (req, res, next) => {
  try {
    req.body.updatedBy = req.user._id;
    req.body.updatedAt = Date.now();

    const projectOnboarding = await ProjectOnboarding.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!projectOnboarding) {
      return new ErrorResponseJSON(res, "ProjectOnboarding not updated!", 400);
    }

    if (
      projectOnboarding.isApproved &&
      projectOnboarding.status != "Completed" &&
      projectOnboarding.status != "Started"
    ) {
      projectOnboarding.status = "Started";
    } else if (projectOnboarding.isApproved && projectOnboarding.status != "Started") {
      projectOnboarding.status = "Completed";
    } else if (projectOnboardingprojectOnboarding.status == "Terminated") {
      projectOnboarding.isApproved = false;
    }
    await projectOnboarding.save();

    /**
     * TODO:
     * Post-conditions:
     * • If the selected contract type is ‘existing contract’ the system shall send an email notification to the PDO to specify evaluation officers and save the project to the ‘renewal list’
     * • If the selected contract type is ‘new’ the system shall send an email notification to the PDO with a link to scope the project and save the project to the ‘New project list’
     */
    await projectOnboardingUpdateEmail(projectOnboarding, req, res, next);

    // /**
    //  * TODO:
    //  * project assignment email
    //  */
    // if (req.body.responsibleOfficer) await projectAssignmentEmail(projectOnboarding);

    res.status(200).json({
      success: true,
      data: projectOnboarding,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Delete ProjectOnboarding
// @route  DELETE /api/v1/projectOnboarding
// @access   Private
exports.deleteProjectOnboarding = asyncHandler(async (req, res, next) => {
  try {
    const projectOnboarding = await ProjectOnboarding.findByIdAndDelete(req.params.id);

    if (!projectOnboarding) {
      return new ErrorResponseJSON(res, "ProjectOnboarding not found!", 404);
    }
    res.status(200).json({
      success: true,
      data: projectOnboarding,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// TODO: Add started and terminated endpoints
// @desc    Get all Started ProjectOnboardings
// @route  GET /api/v1/projectOnboarding/started
// @access   Public
exports.getAllStartedProjectOnboardings = asyncHandler(async (req, res, next) => {
  try {
    const startedProjectOnboarding = await ProjectOnboarding.find({status: "Started"}).populate(
      this.populateProjectOnboardingDetails
    );

    // if (startedProjectOnboarding.length < 1) {
    //   return new ErrorResponseJSON(res, "Started ProjectOnboardings not found!", 404);
    // }
    res.status(200).json({
      success: true,
      data: startedProjectOnboarding,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Get all Terminated ProjectOnboardings
// @route  GET /api/v1/projectOnboarding/terminated
// @access   Public
exports.getAllTerminatedProjectOnboardings = asyncHandler(async (req, res, next) => {
  try {
    const terminatedProjectOnboarding = await ProjectOnboarding.find({status: "Terminated"}).populate(
      this.populateProjectOnboardingDetails
    );

    // if (terminatedProjectOnboarding.length < 1) {
    //   return new ErrorResponseJSON(res, "Terminated ProjectOnboardings not found!", 404);
    // }
    res.status(200).json({
      success: true,
      data: terminatedProjectOnboarding,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// TODO: add endpoint for uploading supporting documents
// @desc    Upload ProjectOnboarding Documents
// @route  PATCH /api/v1/projectOnboarding/:id/upload
// @access   Private
exports.uploadProjectOnboardingDocuments = asyncHandler(async (req, res, next) => {
  try {

    const {file} = req
    if (!file) return new ErrorResponseJSON(res, "No files provided!", 400);

    const projectOnboarding = await ProjectOnboarding.findById(req.params.id)
      .populate(this.populateProjectOnboardingDetails);

    if (!projectOnboarding) {
      return new ErrorResponseJSON(res, "ProjectOnboarding not found!", 404);
    }
    const projectInitiation = await ProjectInitiation.findById(projectOnboarding.project)
    const documentLinks = uploadProjectDocuments(req, res, projectInitiation, file, "onboarding")
    projectOnboarding.files = documentLinks
    await projectOnboarding.save()

    res.status(200).json({
      success: true,
      data: projectOnboarding,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Get all Pending ProjectOnboardings
// @route  GET /api/v1/projectOnboarding/pending
// @access   Public
exports.getAllPendingProjectOnboardings = asyncHandler(async (req, res, next) => {
  try {
    const pendingProjectOnboarding = await ProjectOnboarding.find({status: "Pending"}).populate(
      this.populateProjectOnboardingDetails
    );

    // if (pendingProjectOnboarding.length < 1) {
    //   return new ErrorResponseJSON(res, "Pending ProjectOnboardings not found!", 404);
    // }
    res.status(200).json({
      success: true,
      data: pendingProjectOnboarding,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Get all Completed ProjectOnboardings
// @route  GET /api/v1/projectOnboarding/completed
// @access   Public
exports.getAllCompletedProjectOnboardings = asyncHandler(async (req, res, next) => {
  try {
    const completedProjectOnboarding = await ProjectOnboarding.find({status: "Completed"}).populate(
      this.populateProjectOnboardingDetails
    );

    // if (completedProjectOnboarding.length < 1) {
    //   return new ErrorResponseJSON(res, "Completed ProjectOnboardings not found!", 404);
    // }
    res.status(200).json({
      success: true,
      data: completedProjectOnboarding,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// TODO: Add terminate project onboarding endpoint
// @desc    Terminate ProjectOnboarding
// @route  GET /api/v1/projectOnboarding/:id/terminate
// @access   Private
exports.terminateProjectOnboarding = asyncHandler(async (req, res, next) => {
  try {
    const projectOnboarding = await ProjectOnboarding.findById(req.params.id).populate(
      this.populateProjectOnboardingDetails
    );

    if (!projectOnboarding) {
      return new ErrorResponseJSON(res, "ProjectOnboarding not found!", 404);
    }

    projectOnboarding.status = "Terminated";
    projectOnboarding.save();

    res.status(200).json({
      success: true,
      data: projectOnboarding,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// TODO: Add update status endpoints
// @desc    Update ProjectOnboarding Status
// @route  PATCH /api/v1/projectOnboarding/:id/status
// @access   Private
exports.updateProjectOnboardingStatus = asyncHandler(async (req, res, next) => {
  try {
    existingProjectOnboarding = await ProjectOnboarding.findById(req.params.id).populate(
      this.populateProjectOnboardingDetails
    );

    req.body.updatedBy = req.user._id;
    req.body.updatedAt = Date.now();

    const {status} = req.body;

    const projectOnboarding = await ProjectOnboarding.findByIdAndUpdate(
      req.params.id,
      {status},
      {
        new: true,
        runValidators: true,
      }
    );

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
    await projectOnboardingUpdateEmail(projectOnboarding, req, res, next);

    res.status(200).json({
      success: true,
      data: projectOnboarding,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});
