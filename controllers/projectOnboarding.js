const asyncHandler = require("../middleware/async");
const ProjectInitiation = require("../models/ProjectInitiation");
const ProjectOnboarding = require("../models/ProjectOnboarding");
const {ErrorResponseJSON} = require("../utils/errorResponse");
const {projectOnboardingEmail, projectOnboardingUpdateEmail} = require("../utils/projectEmail");


// @desc    Create ProjectOnboarding
// @route  POST /api/v1/projectOnboarding
// @access   Private
exports.createProjectOnboarding = asyncHandler(async (req, res, next) => {

  const existingProjectOnboarding = await ProjectOnboarding.find({projectTitle: req.body.projectTitle})

  if (existingProjectOnboarding.length > 0) {
    return new ErrorResponseJSON(res, "This projectOnboarding already exists, update it instead!", 400)
  }

  req.body.name = req.user.fullname
  req.body.email = req.user.email
  req.body.createdBy = req.user._id

  const projectOnboarding = await ProjectOnboarding.create(req.body)

  if (!projectOnboarding) {
    return new ErrorResponseJSON(res, "ProjectOnboarding not created!", 404)
  }

  if (projectOnboarding.isApproved && projectOnboarding.status != "Completed" && projectOnboarding.status != "Started") {
    projectOnboarding.status = "Started"
  } else if (projectOnboarding.isApproved && projectOnboarding.status != "Started") {
    projectOnboarding.status = "Completed"
  } else if (projectOnboardingprojectOnboarding.status == "Terminated") {
    projectOnboarding.isApproved = false
  }
  await projectOnboarding.save()

  if (projectOnboarding.isApproved && projectOnboarding.status == "Completed") {
    const projectInitiation = await ProjectInitiation.findById(projectOnboarding.project)
    projectInitiation.status = "Approved"
    projectInitiation.isApproved = true
    projectInitiation.isOnboarded = true
    await projectInitiation.save()
  }

  /**
   * TODO:
   * Post-conditions:
   * • If the selected contract type is ‘existing contract’ the system shall send an email notification to the PDO to specify evaluation officers and save the project to the ‘renewal list’
   * • If the selected contract type is ‘new’ the system shall send an email notification to the PDO with a link to scope the project and save the project to the ‘New project list’ 
   */
  await projectOnboardingEmail(projectOnboarding, req, res, next)

  res.status(200).json({
    success: true,
    data: projectOnboarding,
  })
})


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
  const projectOnboarding = await ProjectOnboarding.findById(req.params.id);

  if (!projectOnboarding) {
    return new ErrorResponseJSON(res, "ProjectOnboarding not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: projectOnboarding,
  });
});


// @desc    Update ProjectOnboarding
// @route  PATCH /api/v1/projectOnboarding/:id
// @access   Private
exports.updateProjectOnboarding = asyncHandler(async (req, res, next) => {

  req.body.updatedBy = req.user._id
  req.body.updatedAt = Date.now()

  const projectOnboarding = await ProjectOnboarding.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!projectOnboarding) {
    return new ErrorResponseJSON(res, "ProjectOnboarding not updated!", 400);
  }

  if (projectOnboarding.isApproved && projectOnboarding.status != "Completed" && projectOnboarding.status != "Started") {
    projectOnboarding.status = "Started"
  } else if (projectOnboarding.isApproved && projectOnboarding.status != "Started") {
    projectOnboarding.status = "Completed"
  } else if (projectOnboardingprojectOnboarding.status == "Terminated") {
    projectOnboarding.isApproved = false
  }
  await projectOnboarding.save()

  /**
   * TODO:
   * Post-conditions:
   * • If the selected contract type is ‘existing contract’ the system shall send an email notification to the PDO to specify evaluation officers and save the project to the ‘renewal list’
   * • If the selected contract type is ‘new’ the system shall send an email notification to the PDO with a link to scope the project and save the project to the ‘New project list’ 
   */
  await projectOnboardingUpdateEmail(projectOnboarding, req, res, next)

  res.status(200).json({
    success: true,
    data: projectOnboarding,
  });
});


// @desc    Delete ProjectOnboarding
// @route  DELETE /api/v1/projectOnboarding
// @access   Private
exports.deleteProjectOnboarding = asyncHandler(async (req, res, next) => {
  const projectOnboarding = await ProjectOnboarding.findByIdAndDelete(req.params.id);

  if (!projectOnboarding) {
    return new ErrorResponseJSON(res, "ProjectOnboarding not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: projectOnboarding,
  });
});

// TODO: Add started and terminated endpoints

// TODO: Add update status endpoints
