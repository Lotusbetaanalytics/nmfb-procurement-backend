const asyncHandler = require("../middleware/async");
const ContractType = require("../models/ContractType");
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse");
const {addUserDetails, checkInstance} = require("../utils/queryUtils");


exports.populateContractType = ""


// @desc    Create ContractType
// @route  POST /api/v1/contractType
// @access   Private
exports.createContractType = asyncHandler(async (req, res, next) => {
  // check for existing contract type instance
  await  this.checkContractType(req, res, {title: req.body.title})

  const contractType = await ContractType.create(req.body);
  if (!contractType) {
    return new ErrorResponseJSON(res, "ContractType not created!", 404);
  }
  return new SuccessResponseJSON(res, contractType)
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
  const contractType = await this.checkContractType(req, res)
  return new SuccessResponseJSON(res, contractType)
});


// @desc    Update ContractType
// @route  PATCH /api/v1/contractType/:id
// @access   Private
exports.updateContractType = asyncHandler(async (req, res, next) => {
  const contractType = await ContractType.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!contractType) {
    return new ErrorResponseJSON(res, "ContractType not updated!", 400);
  }
  return new SuccessResponseJSON(res, contractType)
});


// @desc    Delete ContractType
// @route  DELETE /api/v1/contractType
// @access   Private
exports.deleteContractType = asyncHandler(async (req, res, next) => {
  const contractType = await ContractType.findByIdAndDelete(req.params.id);
  if (!contractType) {
    return new ErrorResponseJSON(res, "ContractType not found!", 404);
  }
  return new SuccessResponseJSON(res, contractType)
});


exports.checkContractType = async (req, res, query = {}) => {
  /**
   * @summary
   *  check if Contract Type instance exists, check if req.params.id exists and perform logic based on that
   * 
   * @throws `Contract Type not Found!`, 404
   * @throws `This Contract Type already exists, update it instead!`, 400
   * 
   * @returns Contract Type instance
   */
  let contractType = await checkInstance(
    req, res, ContractType, this.populateContractType, query, "Contract Type"
  )
  return contractType
}
