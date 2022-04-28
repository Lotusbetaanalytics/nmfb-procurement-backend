const asyncHandler = require("../middleware/async");
const ProjectInitiation = require("../models/ProjectInitiation");
const {ErrorResponseJSON} = require("../utils/errorResponse");


// @desc    Create ProjectInitiation
// @route  POST /api/v1/projectInitiation
// @access   Private
exports.createProjectInitiation = asyncHandler(async (req, res, next) => {

  const existingProjectInitiation = await ProjectInitiation.find({projectTitle: req.body.projectTitle})

  if (existingProjectInitiation.length > 0) {
    return new ErrorResponseJSON(res, "This projectInitiation already exists, update it instead!", 400)
  }

  const projectInitiation = await ProjectInitiation.create(req.body)

  if (!projectInitiation) {
    return new ErrorResponseJSON(res, "ProjectInitiation not created!", 404)
  }
  res.status(200).json({
    success: true,
    data: projectInitiation,
  })
})


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
  const projectInitiation = await ProjectInitiation.findById(req.params.id);

  if (!projectInitiation) {
    return new ErrorResponseJSON(res, "ProjectInitiation not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: projectInitiation,
  });
});


// @desc    Update ProjectInitiation
// @route  PATCH /api/v1/projectInitiation/:id
// @access   Private
exports.updateProjectInitiation = asyncHandler(async (req, res, next) => {
  const projectInitiation = await ProjectInitiation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!projectInitiation) {
    return new ErrorResponseJSON(res, "ProjectInitiation not updated!", 400);
  }
  res.status(200).json({
    success: true,
    data: projectInitiation,
  });
});


// @desc    Delete ProjectInitiation
// @route  DELETE /api/v1/projectInitiation
// @access   Private
exports.deleteProjectInitiation = asyncHandler(async (req, res, next) => {
  const projectInitiation = await ProjectInitiation.findByIdAndDelete(req.params.id);

  if (!projectInitiation) {
    return new ErrorResponseJSON(res, "ProjectInitiation not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: projectInitiation,
  });
});
