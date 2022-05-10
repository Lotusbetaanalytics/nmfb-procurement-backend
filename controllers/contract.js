const asyncHandler = require("../middleware/async");
const Contract = require("../models/Contract");
const {ErrorResponseJSON} = require("../utils/errorResponse");


// @desc    Create Contract
// @route  POST /api/v1/contract
// @access   Private
exports.createContract = asyncHandler(async (req, res, next) => {

  const existingContract = await Contract.find({title: req.body.title})

  if (existingContract.length > 0) {
    return new ErrorResponseJSON(res, "This contract already exists, update it instead!", 400)
  }

  const contract = await Contract.create(req.body)

  if (!contract) {
    return new ErrorResponseJSON(res, "Contract not created!", 404)
  }
  res.status(200).json({
    success: true,
    data: contract,
  })
})


// @desc    Get all Contracts
// @route  GET /api/v1/contract
// @access   Public
exports.getAllContracts = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});


// @desc    Get Contract
// @route  GET /api/v1/contract/:id
// @access   Private
exports.getContract = asyncHandler(async (req, res, next) => {
  const contract = await Contract.findById(req.params.id);

  if (!contract) {
    return new ErrorResponseJSON(res, "Contract not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: contract,
  });
});


// @desc    Update Contract
// @route  PATCH /api/v1/contract/:id
// @access   Private
exports.updateContract = asyncHandler(async (req, res, next) => {
  const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!contract) {
    return new ErrorResponseJSON(res, "Contract not updated!", 400);
  }
  res.status(200).json({
    success: true,
    data: contract,
  });
});


// @desc    Delete Contract
// @route  DELETE /api/v1/contract
// @access   Private
exports.deleteContract = asyncHandler(async (req, res, next) => {
  const contract = await Contract.findByIdAndDelete(req.params.id);

  if (!contract) {
    return new ErrorResponseJSON(res, "Contract not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: contract,
  });
});
