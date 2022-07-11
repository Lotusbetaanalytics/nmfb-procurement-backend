const asyncHandler = require("../middleware/async");
const ProjectType = require("../models/ProjectType");
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse");
const {addUserDetails, checkInstance} = require("../utils/queryUtils");


exports.populateProjectType = undefined


// @desc    Create ProjectType
// @route  POST /api/v1/projectType
// @access   Private
exports.createProjectType = asyncHandler(async (req, res, next) => {
    // const existingProjectType = await ProjectType.find({title: req.body.title});

    // if (existingProjectType.length > 0) {
    //   return new ErrorResponseJSON(res, "This projectType already exists, update it instead!", 400);
    // }

    await this.checkProjectType(req, res, {title: req.body.title})

    const projectType = await ProjectType.create(req.body);
    if (!projectType) {
      return new ErrorResponseJSON(res, "ProjectType not created!", 404);
    }
    return new SuccessResponseJSON(res, projectType)
});


// @desc    Get all ProjectTypes
// @route  GET /api/v1/projectType
// @access   Public
exports.getAllProjectTypes = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});


// @desc    Get ProjectType
// @route  GET /api/v1/projectType/:id
// @access   Private
exports.getProjectType = asyncHandler(async (req, res, next) => {
    // const projectType = await ProjectType.findById(req.params.id);

    // if (!projectType) {
    //   return new ErrorResponseJSON(res, "ProjectType not found!", 404);
    // }
    const projectType = await this.checkProjectType(req, res)
    return new SuccessResponseJSON(res, projectType)
});


// @desc    Update ProjectType
// @route  PATCH /api/v1/projectType/:id
// @access   Private
exports.updateProjectType = asyncHandler(async (req, res, next) => {
    const projectType = await ProjectType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!projectType) {
      return new ErrorResponseJSON(res, "ProjectType not updated!", 400);
    }
    return new SuccessResponseJSON(res, projectType)
});


// @desc    Delete ProjectType
// @route  DELETE /api/v1/projectType
// @access   Private
exports.deleteProjectType = asyncHandler(async (req, res, next) => {
    const projectType = await ProjectType.findByIdAndDelete(req.params.id);
    if (!projectType) {
      return new ErrorResponseJSON(res, "ProjectType not found!", 404);
    }
    return new SuccessResponseJSON(res, projectType)
});


exports.checkProjectType = async (req, res, query = {}) => {
  /**
   * @summary
   *  check if Project Type instance exists, check if req.params.id exists and perform logic based on that
   * 
   * @throws `Project Type not Found!`, 404
   * @throws `This Project Type already exists, update it instead!`, 400
   * 
   * @returns product initiation instance 
   */
  let projectType = await checkInstance(
    req, res, ProjectType, this.populateProjectType, query, "Project Type"
  )
  return projectType
}
