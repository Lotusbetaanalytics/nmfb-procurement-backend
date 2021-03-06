const { resolveModuleName } = require("typescript");
const asyncHandler = require("../middleware/async");
const ProjectStage = require("../models/ProjectStage");
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse");
const {addUserDetails, checkInstance} = require("../utils/queryUtils");


exports.populateProjectStage = ""


// @desc    Create ProjectStage
// @route  POST /api/v1/projectStage
// @access   Private
exports.createProjectStage = asyncHandler(async (req, res, next) => {
  // check for existing project stage instance
  await this.checkProjectStage(req, res, {title: req.body.title})

  const projectStage = await ProjectStage.create(req.body);
  if (!projectStage) {
    return new ErrorResponseJSON(res, "ProjectStage not created!", 404);
  }
  return new SuccessResponseJSON(res, projectStage)
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
  const projectStage = await this.checkProjectStage(req, resolveModuleName)
  return new SuccessResponseJSON(res, projectStage)
});


// @desc    Update ProjectStage
// @route  PATCH /api/v1/projectStage/:id
// @access   Private
exports.updateProjectStage = asyncHandler(async (req, res, next) => {
  const projectStage = await ProjectStage.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!projectStage) {
    return new ErrorResponseJSON(res, "ProjectStage not updated!", 400);
  }
  return new SuccessResponseJSON(res, projectStage)
});


// @desc    Delete ProjectStage
// @route  DELETE /api/v1/projectStage
// @access   Private
exports.deleteProjectStage = asyncHandler(async (req, res, next) => {
  const projectStage = await ProjectStage.findByIdAndDelete(req.params.id);
  if (!projectStage) {
    return new ErrorResponseJSON(res, "ProjectStage not found!", 404);
  }
  return new SuccessResponseJSON(res, projectStage)
});


exports.checkProjectStage = async (req, res, query = {}) => {
  /**
   * @summary
   *  check if Project Stage instance exists, check if req.params.id exists and perform logic based on that
   * 
   * @throws `Project Stage not Found!`, 404
   * @throws `This Project Stage already exists, update it instead!`, 400
   * 
   * @returns Project Stage instance
   */
  let projectStage = await checkInstance(
    req, res, ProjectStage, this.populateProjectStage, query, "Project Stage"
  )
  return projectStage
}
