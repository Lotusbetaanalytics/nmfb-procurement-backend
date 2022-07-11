const asyncHandler = require("../middleware/async");
const Role = require("../models/Role");
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse");
const {addUserDetails, checkInstance} = require("../utils/queryUtils");


exports.populateRole = ""


// @desc    Create Role
// @route  POST /api/v1/role
// @access   Private
exports.createRole = asyncHandler(async (req, res, next) => {
  // check for existing role instance
  await this.checkRole(req, res, {title: req.body.title})

  const role = await Role.create(req.body);
  if (!role) {
    return new ErrorResponseJSON(res, "Role not created!", 404);
  }
  return new SuccessResponseJSON(res, role)
});


// @desc    Get all Roles
// @route  GET /api/v1/role
// @access   Public
exports.getAllRoles = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});


// @desc    Get Role
// @route  GET /api/v1/role/:id
// @access   Private
exports.getRole = asyncHandler(async (req, res, next) => {
  const role = await this.checkRole(req, res)
  return new SuccessResponseJSON(res, role)
});


// @desc    Update Role
// @route  PATCH /api/v1/role/:id
// @access   Private
exports.updateRole = asyncHandler(async (req, res, next) => {
  const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!role) {
    return new ErrorResponseJSON(res, "Role not updated!", 400);
  }
  return new SuccessResponseJSON(res, role)
});


// @desc    Delete Role
// @route  DELETE /api/v1/role
// @access   Private
exports.deleteRole = asyncHandler(async (req, res, next) => {
  const role = await Role.findByIdAndDelete(req.params.id);
  if (!role) {
    return new ErrorResponseJSON(res, "Role not found!", 404);
  }
  return new SuccessResponseJSON(res, role)
});


exports.checkRole = async (req, res, query = {}) => {
  /**
   * @summary
   *  check if Role instance exists, check if req.params.id exists and perform logic based on that
   * 
   * @throws `Role not Found!`, 404
   * @throws `This Role already exists, update it instead!`, 400
   * 
   * @returns Role instance
   */
  let role = await checkInstance(
    req, res, Role, this.populateRole, query, "Role"
  )
  return role
}
