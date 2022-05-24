const asyncHandler = require("../middleware/async");
const ProjectStage = require("../models/ProjectStage");
const {ErrorResponseJSON} = require("../utils/errorResponse");


// @desc    Create ProjectStage
// @route  POST /api/v1/projectStage
// @access   Private
exports.createProjectStage = asyncHandler(async (req, res, next) => {
  try {
    const existingProjectStage = await ProjectStage.find({title: req.body.title});

    if (existingProjectStage.length > 0) {
      return new ErrorResponseJSON(res, "This projectStage already exists, update it instead!", 400);
    }

    const projectStage = await ProjectStage.create(req.body);

    if (!projectStage) {
      return new ErrorResponseJSON(res, "ProjectStage not created!", 404);
    }
    res.status(200).json({
      success: true,
      data: projectStage,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Get all ProjectStages
// @route  GET /api/v1/projectStage
// @access   Public
exports.getAllProjectStages = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});


// @desc    Get ProjectStage
// @route  GET /api/v1/projectStage/:id
// @access   Private
exports.getProjectStage = asyncHandler(async (req, res, next) => {
  try {
    const projectStage = await ProjectStage.findById(req.params.id);

    if (!projectStage) {
      return new ErrorResponseJSON(res, "ProjectStage not found!", 404);
    }
    res.status(200).json({
      success: true,
      data: projectStage,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Update ProjectStage
// @route  PATCH /api/v1/projectStage/:id
// @access   Private
exports.updateProjectStage = asyncHandler(async (req, res, next) => {
  try {
    const projectStage = await ProjectStage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!projectStage) {
      return new ErrorResponseJSON(res, "ProjectStage not updated!", 400);
    }
    res.status(200).json({
      success: true,
      data: projectStage,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Delete ProjectStage
// @route  DELETE /api/v1/projectStage
// @access   Private
exports.deleteProjectStage = asyncHandler(async (req, res, next) => {
  try {
    const projectStage = await ProjectStage.findByIdAndDelete(req.params.id);

    if (!projectStage) {
      return new ErrorResponseJSON(res, "ProjectStage not found!", 404);
    }
    res.status(200).json({
      success: true,
      data: projectStage,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});
