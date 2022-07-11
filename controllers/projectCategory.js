const asyncHandler = require("../middleware/async");
const ProjectCategory = require("../models/ProjectCategory");
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse");
const {addUserDetails, checkInstance} = require("../utils/queryUtils");


exports.populateProjectCategory = ""


// @desc    Create ProjectCategory
// @route  POST /api/v1/projectCategory
// @access   Private
exports.createProjectCategory = asyncHandler(async (req, res, next) => {
  // check for existing project category instance
  await this.checkProjectCategory(req, res, {title: req.body.title})

  const projectCategory = await ProjectCategory.create(req.body);
  if (!projectCategory) {
    return new ErrorResponseJSON(res, "ProjectCategory not created!", 404);
  }
  return new SuccessResponseJSON(res, projectCategory)
});


// @desc    Get all ProjectCategorys
// @route  GET /api/v1/projectCategory
// @access   Public
exports.getAllProjectCategorys = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});


// @desc    Get ProjectCategory
// @route  GET /api/v1/projectCategory/:id
// @access   Private
exports.getProjectCategory = asyncHandler(async (req, res, next) => {
  const projectCategory = await this.checkProjectCategory(req, res)
  return new SuccessResponseJSON(res, projectCategory)
});


// @desc    Update ProjectCategory
// @route  PATCH /api/v1/projectCategory/:id
// @access   Private
exports.updateProjectCategory = asyncHandler(async (req, res, next) => {
  const projectCategory = await ProjectCategory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!projectCategory) {
    return new ErrorResponseJSON(res, "ProjectCategory not updated!", 400);
  }
  return new SuccessResponseJSON(res, projectCategory)
});


// @desc    Delete ProjectCategory
// @route  DELETE /api/v1/projectCategory
// @access   Private
exports.deleteProjectCategory = asyncHandler(async (req, res, next) => {
  const projectCategory = await ProjectCategory.findByIdAndDelete(req.params.id);
  if (!projectCategory) {
    return new ErrorResponseJSON(res, "ProjectCategory not found!", 404);
  }
  return new SuccessResponseJSON(res, projectCategory)
});


exports.checkProjectCategory = async (req, res, query = {}) => {
  /**
   * @summary
   *  check if Project Category instance exists, check if req.params.id exists and perform logic based on that
   * 
   * @throws `Project Category not Found!`, 404
   * @throws `This Project Category already exists, update it instead!`, 400
   * 
   * @returns Project Category instance
   */
  let projectCategory = await checkInstance(
    req, res, ProjectCategory, this.populateProjectCategory, query, "Project Category"
  )
  return projectCategory
}
