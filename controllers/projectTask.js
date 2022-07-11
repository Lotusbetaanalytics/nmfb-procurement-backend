const asyncHandler = require("../middleware/async");
const ProjectTask = require("../models/ProjectTask");
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse");
const {projectTaskAssignmentEmail, projectTaskReassignmentEmail} = require("../utils/projectEmail");
const {addUserDetails, checkInstance} = require("../utils/queryUtils");


exports.populateProjectTask = "project assignedBy assignedTo reassignedTo responsibleOfficer responsibleUnit createdBy"


// @desc    Create ProjectTask
// @route  POST /api/v1/projectTask
// @access   Private
exports.createProjectTask = asyncHandler(async (req, res, next) => {
  // check for existing project task
  await this.checkProjectTask(req, res, {title: req.body.title})

  const projectTask = await ProjectTask.create(req.body);
  if (!projectTask) {
    return new ErrorResponseJSON(res, "ProjectTask not created!", 404);
  }

  await projectTaskAssignmentEmail(projectTask, req, res, next);

  return new SuccessResponseJSON(res, projectTask)
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
  const projectTask = await this.checkProjectTask(req, res)
  return new SuccessResponseJSON(res, projectTask)
});


// @desc    Update ProjectTask
// @route  PATCH /api/v1/projectTask/:id
// @access   Private
exports.updateProjectTask = asyncHandler(async (req, res, next) => {
  const projectTask = await ProjectTask.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!projectTask) {
    return new ErrorResponseJSON(res, "ProjectTask not updated!", 400);
  }

  if ("reassignedTo" in req.body) {
    await projectTaskReassignmentEmail(projectTask, req, res, next);
  }
  return new SuccessResponseJSON(res, projectTask)
});


// @desc    Delete ProjectTask
// @route  DELETE /api/v1/projectTask
// @access   Private
exports.deleteProjectTask = asyncHandler(async (req, res, next) => {
  const projectTask = await ProjectTask.findByIdAndDelete(req.params.id);
  if (!projectTask) {
    return new ErrorResponseJSON(res, "ProjectTask not found!", 404);
  }
  return new SuccessResponseJSON(res, projectTask)
});


exports.checkProjectTask = async (req, res, query = {}) => {
  /**
   * @summary
   *  check if Project Task instance exists, check if req.params.id exists and perform logic based on that
   * 
   * @throws `Project Task not Found!`, 404
   * @throws `This Project Task already exists, update it instead!`, 400
   * 
   * @returns Project Task instance
   */
  let projectTask = await checkInstance(
    req, res, ProjectTask, this.populateProjectTask, query, "Project Task"
  )
  return projectTask
}
