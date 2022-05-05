const asyncHandler = require("../middleware/async");
const ContractEvaluation = require("../models/ContractEvaluation");
const {ErrorResponseJSON} = require("../utils/errorResponse");


// @desc    Create ContractEvaluation
// @route  POST /api/v1/contractEvaluation
// @access   Private
exports.createContractEvaluation = asyncHandler(async (req, res, next) => {

  const existingContractEvaluation = await ContractEvaluation.find({project: req.body.project})

  if (existingContractEvaluation.length > 0) {
    return new ErrorResponseJSON(res, "This contractEvaluation already exists, update it instead!", 400)
  }

  const contractEvaluation = await ContractEvaluation.create(req.body)

  if (!contractEvaluation) {
    return new ErrorResponseJSON(res, "ContractEvaluation not created!", 404)
  }
  res.status(200).json({
    success: true,
    data: contractEvaluation,
  })
})


// @desc    Get all ContractEvaluations
// @route  GET /api/v1/contractEvaluation
// @access   Public
exports.getAllContractEvaluations = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});


// @desc    Get ContractEvaluation
// @route  GET /api/v1/contractEvaluation/:id
// @access   Private
exports.getContractEvaluation = asyncHandler(async (req, res, next) => {
  const contractEvaluation = await ContractEvaluation.findById(req.params.id);

  if (!contractEvaluation) {
    return new ErrorResponseJSON(res, "ContractEvaluation not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: contractEvaluation,
  });
});


// @desc    Update ContractEvaluation
// @route  PATCH /api/v1/contractEvaluation/:id
// @access   Private
exports.updateContractEvaluation = asyncHandler(async (req, res, next) => {
  const contractEvaluation = await ContractEvaluation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!contractEvaluation) {
    return new ErrorResponseJSON(res, "ContractEvaluation not updated!", 400);
  }
  res.status(200).json({
    success: true,
    data: contractEvaluation,
  });
});


// @desc    Delete ContractEvaluation
// @route  DELETE /api/v1/contractEvaluation
// @access   Private
exports.deleteContractEvaluation = asyncHandler(async (req, res, next) => {
  const contractEvaluation = await ContractEvaluation.findByIdAndDelete(req.params.id);

  if (!contractEvaluation) {
    return new ErrorResponseJSON(res, "ContractEvaluation not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: contractEvaluation,
  });
});
