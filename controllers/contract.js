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


// @desc    Get all Active Contracts
// @route  GET /api/v1/contract/active
// @access   Private
exports.getAllActiveContracts = asyncHandler(async (req, res, next) => {
  const contract = await Contract.find({isActive: true});

  if (contract.length() < 1) {
    return new ErrorResponseJSON(res, "Contracts not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: contract,
  });
});


// @desc    Get all Terminated Contracts
// @route  GET /api/v1/contract/terminated
// @access   Private
exports.getAllTerminatedContracts = asyncHandler(async (req, res, next) => {
  const contract = await Contract.find({isActive: false});

  if (contract.length() < 1) {
    return new ErrorResponseJSON(res, "Contracts not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: contract,
  });
});


// @desc    Get all Failed Contracts (Score < 70)
// @route  GET /api/v1/contract/failed
// @access   Private
exports.getAllFailedContracts = asyncHandler(async (req, res, next) => {
  const contract = await Contract.find({score: {$lt: 70}});

  if (contract.length() < 1) {
    return new ErrorResponseJSON(res, "Contracts not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: contract,
  });
});


// @desc    Terminate Contract
// @route  POST /api/v1/contract/:id/terminate
// @access   Private
exports.terminateContract = asyncHandler(async (req, res, next) => {
  const contract = await Contract.findById(req.params.id);

  if (!contract) {
    return new ErrorResponseJSON(res, "Contract not found!", 404);
  }

  if (contract.score != 0 && contract.score < 70) {
    contract.isActive = false
    contract.deactivatedBy = req.user._id
    contract.deactivatedAt = Date.now()
    await contract.save()
  } else {
    return new ErrorResponseJSON(res, "Contract score greater than 70!", 400);
  }

  res.status(200).json({
    success: true,
    data: contract,
  });
});
