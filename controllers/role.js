const asyncHandler = require("../middleware/async");
const Role = require("../models/Role");
const {ErrorResponseJSON} = require("../utils/errorResponse");


// @desc    Create Role
// @route  POST /api/v1/role
// @access   Private
exports.createRole = asyncHandler(async (req, res, next) => {

  const existingRole = await Role.find({title: req.body.title})

  if (existingRole.length > 0) {
    return new ErrorResponseJSON(res, "This role already exists, update it instead!", 400)
  }

  const role = await Role.create(req.body)

  if (!role) {
    return new ErrorResponseJSON(res, "Role not created!", 404)
  }
  res.status(200).json({
    success: true,
    data: role,
  })
})


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
  const role = await Role.findById(req.params.id);

  if (!role) {
    return new ErrorResponseJSON(res, "Role not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: role,
  });
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
  res.status(200).json({
    success: true,
    data: role,
  });
});


// @desc    Delete Role
// @route  DELETE /api/v1/role
// @access   Private
exports.deleteRole = asyncHandler(async (req, res, next) => {
  const role = await Role.findByIdAndDelete(req.params.id);

  if (!role) {
    return new ErrorResponseJSON(res, "Role not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: role,
  });
});
