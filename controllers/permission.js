const asyncHandler = require("../middleware/async");
const Permission = require("../models/Permission");
const {ErrorResponseJSON} = require("../utils/errorResponse");


// @desc    Create Permission
// @route  POST /api/v1/permission
// @access   Private
exports.createPermission = asyncHandler(async (req, res, next) => {
  try {
    const existingPermission = await Permission.find({title: req.body.title});

    if (existingPermission.length > 0) {
      return new ErrorResponseJSON(res, "This permission already exists, update it instead!", 400);
    }

    const permission = await Permission.create(req.body);

    if (!permission) {
      return new ErrorResponseJSON(res, "Permission not created!", 404);
    }
    res.status(200).json({
      success: true,
      data: permission,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
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
  try {
    const permission = await Permission.findById(req.params.id);

    if (!permission) {
      return new ErrorResponseJSON(res, "Permission not found!", 404);
    }
    res.status(200).json({
      success: true,
      data: permission,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Update Permission
// @route  PATCH /api/v1/permission/:id
// @access   Private
exports.updatePermission = asyncHandler(async (req, res, next) => {
  try {
    const permission = await Permission.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!permission) {
      return new ErrorResponseJSON(res, "Permission not updated!", 400);
    }
    res.status(200).json({
      success: true,
      data: permission,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Delete Permission
// @route  DELETE /api/v1/permission
// @access   Private
exports.deletePermission = asyncHandler(async (req, res, next) => {
  try {
    const permission = await Permission.findByIdAndDelete(req.params.id);

    if (!permission) {
      return new ErrorResponseJSON(res, "Permission not found!", 404);
    }
    res.status(200).json({
      success: true,
      data: permission,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});
