const asyncHandler = require("../middleware/async");
const BudgetLineItem = require("../models/BudgetLineItem");
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse");
const {checkInstance} = require("../utils/queryUtils");


exports.populateBudgetLineItem = ""


// @desc    Create BudgetLineItem
// @route  POST /api/v1/budgetLineItem
// @access   Private
exports.createBudgetLineItem = asyncHandler(async (req, res, next) => {
  // check budget line item instance
  await this.checkBudgetLineItem(req, res, {title: req.body.title})

  const budgetLineItem = await BudgetLineItem.create(req.body);
  if (!budgetLineItem) {
    return new ErrorResponseJSON(res, "BudgetLineItem not created!", 404);
  }
  return new SuccessResponseJSON(res, budgetLineItem)
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
  const budgetLineItem = await this.checkBudgetLineItem(req, res)
  return new SuccessResponseJSON(res, budgetLineItem)
});


// @desc    Update BudgetLineItem
// @route  PATCH /api/v1/budgetLineItem/:id
// @access   Private
exports.updateBudgetLineItem = asyncHandler(async (req, res, next) => {
  const budgetLineItem = await BudgetLineItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!budgetLineItem) {
    return new ErrorResponseJSON(res, "BudgetLineItem not updated!", 400);
  }
  return new SuccessResponseJSON(res, budgetLineItem)
});


// @desc    Delete BudgetLineItem
// @route  DELETE /api/v1/budgetLineItem
// @access   Private
exports.deleteBudgetLineItem = asyncHandler(async (req, res, next) => {
  const budgetLineItem = await BudgetLineItem.findByIdAndDelete(req.params.id);
  if (!budgetLineItem) {
    return new ErrorResponseJSON(res, "BudgetLineItem not found!", 404);
  }
  return new SuccessResponseJSON(res, budgetLineItem)
});


exports.checkBudgetLineItem = async (req, res, query = {}) => {
  /**
   * @summary
   *  check if Budget Line Item instance exists, check if req.params.id exists and perform logic based on that
   * 
   * @throws `Budget Line Item not Found!`, 404
   * @throws `This Budget Line Item already exists, update it instead!`, 400
   * 
   * @returns product initiation instance 
   */
  let budgetLineItem = await checkInstance(
    req, res, BudgetLineItem, this.populateBudgetLineItem, query, "Budget Line Item"
  )
  return budgetLineItem
}
