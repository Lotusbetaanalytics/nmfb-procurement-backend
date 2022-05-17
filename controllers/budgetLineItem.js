const asyncHandler = require("../middleware/async");
const BudgetLineItem = require("../models/BudgetLineItem");
const {ErrorResponseJSON} = require("../utils/errorResponse");


// @desc    Create BudgetLineItem
// @route  POST /api/v1/budgetLineItem
// @access   Private
exports.createBudgetLineItem = asyncHandler(async (req, res, next) => {
  try {
    const existingBudgetLineItem = await BudgetLineItem.find({title: req.body.title});

    if (existingBudgetLineItem.length > 0) {
      return new ErrorResponseJSON(res, "This budgetLineItem already exists, update it instead!", 400);
    }

    const budgetLineItem = await BudgetLineItem.create(req.body);

    if (!budgetLineItem) {
      return new ErrorResponseJSON(res, "BudgetLineItem not created!", 404);
    }
    res.status(200).json({
      success: true,
      data: budgetLineItem,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Get all BudgetLineItems
// @route  GET /api/v1/budgetLineItem
// @access   Public
exports.getAllBudgetLineItems = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});


// @desc    Get BudgetLineItem
// @route  GET /api/v1/budgetLineItem/:id
// @access   Private
exports.getBudgetLineItem = asyncHandler(async (req, res, next) => {
  try {
    const budgetLineItem = await BudgetLineItem.findById(req.params.id);

    if (!budgetLineItem) {
      return new ErrorResponseJSON(res, "BudgetLineItem not found!", 404);
    }
    res.status(200).json({
      success: true,
      data: budgetLineItem,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Update BudgetLineItem
// @route  PATCH /api/v1/budgetLineItem/:id
// @access   Private
exports.updateBudgetLineItem = asyncHandler(async (req, res, next) => {
  try {
    const budgetLineItem = await BudgetLineItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!budgetLineItem) {
      return new ErrorResponseJSON(res, "BudgetLineItem not updated!", 400);
    }
    res.status(200).json({
      success: true,
      data: budgetLineItem,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Delete BudgetLineItem
// @route  DELETE /api/v1/budgetLineItem
// @access   Private
exports.deleteBudgetLineItem = asyncHandler(async (req, res, next) => {
  try {
    const budgetLineItem = await BudgetLineItem.findByIdAndDelete(req.params.id);

    if (!budgetLineItem) {
      return new ErrorResponseJSON(res, "BudgetLineItem not found!", 404);
    }
    res.status(200).json({
      success: true,
      data: budgetLineItem,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});
