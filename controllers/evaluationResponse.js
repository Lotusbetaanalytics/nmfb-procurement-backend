const asyncHandler = require("../middleware/async");
const EvaluationResponse = require("../models/EvaluationResponse");
const {ErrorResponseJSON} = require("../utils/errorResponse");


// @desc    Create EvaluationResponse
// @route  POST /api/v1/evaluationResponse
// @access   Private
exports.createEvaluationResponse = asyncHandler(async (req, res, next) => {

  const existingEvaluationResponse = await EvaluationResponse.find({project: req.body.project})

  if (existingEvaluationResponse.length > 0) {
    return new ErrorResponseJSON(res, "This evaluationResponse already exists, update it instead!", 400)
  }

  const evaluationResponse = await EvaluationResponse.create(req.body)

  if (!evaluationResponse) {
    return new ErrorResponseJSON(res, "EvaluationResponse not created!", 404)
  }
  res.status(200).json({
    success: true,
    data: evaluationResponse,
  })
})


// @desc    Get all EvaluationResponses
// @route  GET /api/v1/evaluationResponse
// @access   Public
exports.getAllEvaluationResponses = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});


// @desc    Get EvaluationResponse
// @route  GET /api/v1/evaluationResponse/:id
// @access   Private
exports.getEvaluationResponse = asyncHandler(async (req, res, next) => {
  const evaluationResponse = await EvaluationResponse.findById(req.params.id);

  if (!evaluationResponse) {
    return new ErrorResponseJSON(res, "EvaluationResponse not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: evaluationResponse,
  });
});


// @desc    Update EvaluationResponse
// @route  PATCH /api/v1/evaluationResponse/:id
// @access   Private
exports.updateEvaluationResponse = asyncHandler(async (req, res, next) => {
  const evaluationResponse = await EvaluationResponse.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!evaluationResponse) {
    return new ErrorResponseJSON(res, "EvaluationResponse not updated!", 400);
  }
  res.status(200).json({
    success: true,
    data: evaluationResponse,
  });
});


// @desc    Delete EvaluationResponse
// @route  DELETE /api/v1/evaluationResponse
// @access   Private
exports.deleteEvaluationResponse = asyncHandler(async (req, res, next) => {
  const evaluationResponse = await EvaluationResponse.findByIdAndDelete(req.params.id);

  if (!evaluationResponse) {
    return new ErrorResponseJSON(res, "EvaluationResponse not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: evaluationResponse,
  });
});
