const asyncHandler = require("../middleware/async");
const Permission = require("../models/Permission");
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse");
const {addUserDetails, checkInstance} = require("../utils/queryUtils");


exports.populatePermission = ""


// @desc    Create Permission
// @route  POST /api/v1/permission
// @access   Private
exports.createPermission = asyncHandler(async (req, res, next) => {
  // check for existing permission instance
  await this.checkPermission(req, res, {title: req.body.title})

  const permission = await Permission.create(req.body);
  if (!permission) {
    return new ErrorResponseJSON(res, "Permission not created!", 404);
  }
  return new SuccessResponseJSON(res, permission)
});


// @desc    Get all Permissions
// @route  GET /api/v1/permission
// @access   Public
exports.getAllPermissions = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});


// @desc    Get Permission
// @route  GET /api/v1/permission/:id
// @access   Private
exports.getPermission = asyncHandler(async (req, res, next) => {
  const permission = await this.checkPermission(req, res)
  return new SuccessResponseJSON(res, permission)
});


// @desc    Update Permission
// @route  PATCH /api/v1/permission/:id
// @access   Private
exports.updatePermission = asyncHandler(async (req, res, next) => {
  const permission = await Permission.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!permission) {
    return new ErrorResponseJSON(res, "Permission not updated!", 400);
  }
  return new SuccessResponseJSON(res, permission)
});


// @desc    Delete Permission
// @route  DELETE /api/v1/permission
// @access   Private
exports.deletePermission = asyncHandler(async (req, res, next) => {
  const permission = await Permission.findByIdAndDelete(req.params.id);
  if (!permission) {
    return new ErrorResponseJSON(res, "Permission not found!", 404);
  }
  return new SuccessResponseJSON(res, permission)
});


exports.checkPermission = async (req, res, query = {}) => {
  /**
   * @summary
   *  check if Permission instance exists, check if req.params.id exists and perform logic based on that
   * 
   * @throws `Permission not Found!`, 404
   * @throws `This Permission already exists, update it instead!`, 400
   * 
   * @returns Permission instance
   */
  let permission = await checkInstance(
    req, res, Permission, this.populatePermission, query, "Permission"
  )
  return permission
}
