const asyncHandler = require("../middleware/async");
const SupportingDocuments = require("../models/SupportingDocuments");
const {ErrorResponseJSON} = require("../utils/errorResponse");


// @desc    Create SupportingDocuments
// @route  POST /api/v1/supportingDocuments
// @access   Private
exports.createSupportingDocuments = asyncHandler(async (req, res, next) => {

  const existingSupportingDocuments = await SupportingDocuments.find({title: req.body.title})

  if (existingSupportingDocuments.length > 0) {
    return new ErrorResponseJSON(res, "This supportingDocuments already exists, update it instead!", 400)
  }

  const supportingDocuments = await SupportingDocuments.create(req.body)

  if (!supportingDocuments) {
    return new ErrorResponseJSON(res, "SupportingDocuments not created!", 404)
  }
  res.status(200).json({
    success: true,
    data: supportingDocuments,
  })
})


// @desc    Get all SupportingDocuments
// @route  GET /api/v1/supportingDocuments
// @access   Public
exports.getAllSupportingDocuments = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});


// @desc    Get SupportingDocuments
// @route  GET /api/v1/supportingDocuments/:id
// @access   Private
exports.getSupportingDocuments = asyncHandler(async (req, res, next) => {
  const supportingDocuments = await SupportingDocuments.findById(req.params.id);

  if (!supportingDocuments) {
    return new ErrorResponseJSON(res, "SupportingDocuments not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: supportingDocuments,
  });
});


// @desc    Update SupportingDocuments
// @route  PATCH /api/v1/supportingDocuments/:id
// @access   Private
exports.updateSupportingDocuments = asyncHandler(async (req, res, next) => {
  const supportingDocuments = await SupportingDocuments.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!supportingDocuments) {
    return new ErrorResponseJSON(res, "SupportingDocuments not updated!", 400);
  }
  res.status(200).json({
    success: true,
    data: supportingDocuments,
  });
});


// @desc    Delete SupportingDocuments
// @route  DELETE /api/v1/supportingDocuments
// @access   Private
exports.deleteSupportingDocuments = asyncHandler(async (req, res, next) => {
  const supportingDocuments = await SupportingDocuments.findByIdAndDelete(req.params.id);

  if (!supportingDocuments) {
    return new ErrorResponseJSON(res, "SupportingDocuments not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: supportingDocuments,
  });
});
