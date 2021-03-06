const asyncHandler = require("../middleware/async");
const SupportingDocuments = require("../models/SupportingDocuments");
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse");
const {addUserDetails, checkInstance} = require("../utils/queryUtils");


exports.populateSupportingDocuments = "project projectStage createdBy"


// @desc    Create SupportingDocuments
// @route  POST /api/v1/supportingDocuments
// @access   Private
exports.createSupportingDocuments = asyncHandler(async (req, res, next) => {
  // check for existing supporting document instance
  await this.checkSupportingDocuments(req, res, {documentName: req.body.documentName, project: req.body.project})
  
  // add user details to req.body
  addUserDetails(req)

  const supportingDocuments = await SupportingDocuments.create(req.body);
  if (!supportingDocuments) {
    return new ErrorResponseJSON(res, "SupportingDocuments not created!", 404);
  }
  return new SuccessResponseJSON(res, supportingDocuments)
});


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
  const supportingDocuments = await this.checkSupportingDocuments(req, res)
  return new SuccessResponseJSON(res, supportingDocuments)
});


// @desc    Update SupportingDocuments
// @route  PATCH /api/v1/supportingDocuments/:id
// @access   Private
exports.updateSupportingDocuments = asyncHandler(async (req, res, next) => {
  // add user details to req.body
  addUserDetails(req, true)

  const supportingDocuments = await SupportingDocuments.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!supportingDocuments) {
    return new ErrorResponseJSON(res, "SupportingDocuments not updated!", 400);
  }
  return new SuccessResponseJSON(res, supportingDocuments)
});


// @desc    Delete SupportingDocuments
// @route  DELETE /api/v1/supportingDocuments
// @access   Private
exports.deleteSupportingDocuments = asyncHandler(async (req, res, next) => {
  const supportingDocuments = await SupportingDocuments.findByIdAndDelete(req.params.id);
  if (!supportingDocuments) {
    return new ErrorResponseJSON(res, "SupportingDocuments not found!", 404);
  }
  return new SuccessResponseJSON(res, supportingDocuments)
});


exports.checkSupportingDocuments = async (req, res, query = {}) => {
  /**
   * @summary
   *  check if Supporting Documents instance exists, check if req.params.id exists and perform logic based on that
   * 
   * @throws `Supporting Documents not Found!`, 404
   * @throws `This Supporting Documents already exists, update it instead!`, 400
   * 
   * @returns Supporting Documents instance
   */
  let contractDocuments = await checkInstance(
    req, res, SupportingDocuments, this.populateSupportingDocuments, query, "Supporting Documents"
  )
  return contractDocuments
}
