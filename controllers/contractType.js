const asyncHandler = require("../middleware/async");
const ContractType = require("../models/ContractType");
const {ErrorResponseJSON} = require("../utils/errorResponse");


// @desc    Create ContractType
// @route  POST /api/v1/contractType
// @access   Private
exports.createContractType = asyncHandler(async (req, res, next) => {
  try {
    const existingContractType = await ContractType.find({title: req.body.title});

    if (existingContractType.length > 0) {
      return new ErrorResponseJSON(res, "This contractType already exists, update it instead!", 400);
    }

    const contractType = await ContractType.create(req.body);

    if (!contractType) {
      return new ErrorResponseJSON(res, "ContractType not created!", 404);
    }
    res.status(200).json({
      success: true,
      data: contractType,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Get all ContractTypes
// @route  GET /api/v1/contractType
// @access   Public
exports.getAllContractTypes = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});


// @desc    Get ContractType
// @route  GET /api/v1/contractType/:id
// @access   Private
exports.getContractType = asyncHandler(async (req, res, next) => {
  try {
    const contractType = await ContractType.findById(req.params.id);

    if (!contractType) {
      return new ErrorResponseJSON(res, "ContractType not found!", 404);
    }
    res.status(200).json({
      success: true,
      data: contractType,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Update ContractType
// @route  PATCH /api/v1/contractType/:id
// @access   Private
exports.updateContractType = asyncHandler(async (req, res, next) => {
  try {
    const contractType = await ContractType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!contractType) {
      return new ErrorResponseJSON(res, "ContractType not updated!", 400);
    }
    res.status(200).json({
      success: true,
      data: contractType,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Delete ContractType
// @route  DELETE /api/v1/contractType
// @access   Private
exports.deleteContractType = asyncHandler(async (req, res, next) => {
  try {
    const contractType = await ContractType.findByIdAndDelete(req.params.id);

    if (!contractType) {
      return new ErrorResponseJSON(res, "ContractType not found!", 404);
    }
    res.status(200).json({
      success: true,
      data: contractType,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});
