const asyncHandler = require("../middleware/async");
const ProjectTask = require("../models/ProjectTask");
const {ErrorResponseJSON} = require("../utils/errorResponse");
const {projectAssignmentEmail, projectReassignmentEmail} = require("../utils/projectEmail");


// @desc    Create ProjectTask
// @route  POST /api/v1/projectTask
// @access   Private
exports.createProjectTask = asyncHandler(async (req, res, next) => {
  try {
    const existingProjectTask = await ProjectTask.find({projectTitle: req.body.projectTitle});

    if (existingProjectTask.length > 0) {
      return new ErrorResponseJSON(res, "This projectTask already exists, update it instead!", 400);
    }

    const projectTask = await ProjectTask.create(req.body);

    if (!projectTask) {
      return new ErrorResponseJSON(res, "ProjectTask not created!", 404);
    }

    await projectAssignmentEmail(projectTask, req, res, next);

    res.status(200).json({
      success: true,
      data: projectTask,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Get all ProjectTasks
// @route  GET /api/v1/projectTask
// @access   Public
exports.getAllProjectTasks = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});


// @desc    Get ProjectTask
// @route  GET /api/v1/projectTask/:id
// @access   Private
exports.getProjectTask = asyncHandler(async (req, res, next) => {
  try {
    const projectTask = await ProjectTask.findById(req.params.id);

    if (!projectTask) {
      return new ErrorResponseJSON(res, "ProjectTask not found!", 404);
    }
    res.status(200).json({
      success: true,
      data: projectTask,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Update ProjectTask
// @route  PATCH /api/v1/projectTask/:id
// @access   Private
exports.updateProjectTask = asyncHandler(async (req, res, next) => {
  try {
    const projectTask = await ProjectTask.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!projectTask) {
      return new ErrorResponseJSON(res, "ProjectTask not updated!", 400);
    }

    if ("reassignedTo" in req.body) {
      await projectReassignmentEmail(projectTask, req, res, next);
    }

    res.status(200).json({
      success: true,
      data: projectTask,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Delete ProjectTask
// @route  DELETE /api/v1/projectTask
// @access   Private
exports.deleteProjectTask = asyncHandler(async (req, res, next) => {
  try {
    const projectTask = await ProjectTask.findByIdAndDelete(req.params.id);

    if (!projectTask) {
      return new ErrorResponseJSON(res, "ProjectTask not found!", 404);
    }
    res.status(200).json({
      success: true,
      data: projectTask,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});
