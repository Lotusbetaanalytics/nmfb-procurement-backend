const asyncHandler = require("../middleware/async");
const ProjectOnboarding = require("../models/ProjectOnboarding");
const {ErrorResponseJSON} = require("../utils/errorResponse");


// @desc    Create ProjectOnboarding
// @route  POST /api/v1/projectOnboarding
// @access   Private
exports.createProjectOnboarding = asyncHandler(async (req, res, next) => {

  const existingProjectOnboarding = await ProjectOnboarding.find({projectTitle: req.body.projectTitle})

  if (existingProjectOnboarding.length > 0) {
    return new ErrorResponseJSON(res, "This projectOnboarding already exists, update it instead!", 400)
  }

  const projectOnboarding = await ProjectOnboarding.create(req.body)

  if (!projectOnboarding) {
    return new ErrorResponseJSON(res, "ProjectOnboarding not created!", 404)
  }
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
  const projectOnboarding = await ProjectOnboarding.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!projectOnboarding) {
    return new ErrorResponseJSON(res, "ProjectOnboarding not updated!", 400);
  }
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
