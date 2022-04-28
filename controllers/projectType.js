const asyncHandler = require("../middleware/async");
const ProjectType = require("../models/ProjectType");
const {ErrorResponseJSON} = require("../utils/errorResponse");


// @desc    Create ProjectType
// @route  POST /api/v1/budgetLineItem
// @access   Private
exports.createProjectType = asyncHandler(async (req, res, next) => {

  const existingProjectType = await ProjectType.find({title: req.body.title})

  if (existingProjectType.length > 0) {
    return new ErrorResponseJSON(res, "This budgetLineItem already exists, update it instead!", 400)
  }

  const budgetLineItem = await ProjectType.create(req.body)

  if (!budgetLineItem) {
    return new ErrorResponseJSON(res, "ProjectType not created!", 404)
  }
  res.status(200).json({
    success: true,
    data: budgetLineItem,
  })
})


// @desc    Get all ProjectTypes
// @route  GET /api/v1/budgetLineItem
// @access   Public
exports.getAllProjectTypes = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});


// @desc    Get ProjectType
// @route  GET /api/v1/budgetLineItem/:id
// @access   Private
exports.getProjectType = asyncHandler(async (req, res, next) => {
  const budgetLineItem = await ProjectType.findById(req.params.id);

  if (!budgetLineItem) {
    return new ErrorResponseJSON(res, "ProjectType not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: budgetLineItem,
  });
});


// @desc    Update ProjectType
// @route  PATCH /api/v1/budgetLineItem/:id
// @access   Private
exports.updateProjectType = asyncHandler(async (req, res, next) => {
  const budgetLineItem = await ProjectType.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!budgetLineItem) {
    return new ErrorResponseJSON(res, "ProjectType not updated!", 400);
  }
  res.status(200).json({
    success: true,
    data: budgetLineItem,
  });
});


// @desc    Delete ProjectType
// @route  DELETE /api/v1/budgetLineItem
// @access   Private
exports.deleteProjectType = asyncHandler(async (req, res, next) => {
  const budgetLineItem = await ProjectType.findByIdAndDelete(req.params.id);

  if (!budgetLineItem) {
    return new ErrorResponseJSON(res, "ProjectType not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: budgetLineItem,
  });
});
