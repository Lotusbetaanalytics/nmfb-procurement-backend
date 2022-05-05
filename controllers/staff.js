const asyncHandler = require("../middleware/async");
const Staff = require("../models/Staff");
const {ErrorResponseJSON} = require("../utils/errorResponse");


// @desc    Create Staff
// @route  POST /api/v1/staff
// @access   Private
exports.createStaff = asyncHandler(async (req, res, next) => {

  const existingStaff = await Staff.find({email: req.body.email})
  payload = {
    email: req.body.email,
    role: req.body.role,
    team: req.body.team,
  }

  if (existingStaff.length > 0) {
    return new ErrorResponseJSON(res, "This staff already exists, update it instead!", 400)
  }

  const staff = await Staff.create(payload)

  if (!staff) {
    return new ErrorResponseJSON(res, "Staff not created!", 404)
  }
  res.status(200).json({
    success: true,
    message: "Only email, role and team are accepted",
    data: staff,
  })
})


// @desc    Get all Staffs
// @route  GET /api/v1/staff
// @access   Public
exports.getAllStaffs = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});


// @desc    Get Staff
// @route  GET /api/v1/staff/:id
// @access   Private
exports.getStaff = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    return new ErrorResponseJSON(res, "Staff not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: staff,
  });
});


// @desc    Update Staff
// @route  PATCH /api/v1/staff/:id
// @access   Private
exports.updateStaff = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!staff) {
    return new ErrorResponseJSON(res, "Staff not updated!", 400);
  }
  res.status(200).json({
    success: true,
    data: staff,
  });
});


// @desc    Delete Staff
// @route  DELETE /api/v1/staff
// @access   Private
exports.deleteStaff = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findByIdAndDelete(req.params.id);

  if (!staff) {
    return new ErrorResponseJSON(res, "Staff not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: staff,
  });
});
