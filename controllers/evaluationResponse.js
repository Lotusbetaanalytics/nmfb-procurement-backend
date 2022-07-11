const asyncHandler = require("../middleware/async");
const EvaluationResponse = require("../models/EvaluationResponse");
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse");
const {addUserDetails, checkInstance} = require("../utils/queryUtils");


exports.populateEvaluationResponse = "contract evaluationTemplate createdBy"


// @desc    Create EvaluationResponse
// @route  POST /api/v1/evaluationResponse
// @access   Private
exports.createEvaluationResponse = asyncHandler(async (req, res, next) => {
  // const existingEvaluationResponse = await EvaluationResponse.find({project: req.body.project});

  // if (existingEvaluationResponse.length > 0) {
  //   return new ErrorResponseJSON(res, "This evaluationResponse already exists, update it instead!", 400);
  // }

  // check evaluation response instance
  await this.checkEvaluationResponse(req, res, {evaluationTemplate: req.body.evaluationTemplate, createdBy: req.user._id})

  const evaluationResponse = await EvaluationResponse.create(req.body);
  if (!evaluationResponse) {
    return new ErrorResponseJSON(res, "EvaluationResponse not created!", 404);
  }
  return new SuccessResponseJSON(res, evaluationResponse)
});


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
  // const evaluationResponse = await EvaluationResponse.findById(req.params.id).populate(this.populateEvaluationResponse);

  // if (!evaluationResponse) {
  //   return new ErrorResponseJSON(res, "EvaluationResponse not found!", 404);
  // }
  const evaluationResponse = await this.checkEvaluationResponse(req, res)
  return new SuccessResponseJSON(res, evaluationResponse)
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
  return new SuccessResponseJSON(res, evaluationResponse)
});


// @desc    Delete EvaluationResponse
// @route  DELETE /api/v1/evaluationResponse
// @access   Private
exports.deleteEvaluationResponse = asyncHandler(async (req, res, next) => {
  const evaluationResponse = await EvaluationResponse.findByIdAndDelete(req.params.id);
  if (!evaluationResponse) {
    return new ErrorResponseJSON(res, "EvaluationResponse not found!", 404);
  }
  return new SuccessResponseJSON(res, evaluationResponse)
});


exports.checkEvaluationResponse = async (req, res, query = {}) => {
  /**
   * @summary
   *  check if Evaluation Response instance exists, check if req.params.id exists and perform logic based on that
   * 
   * @throws `Evaluation Response not Found!`, 404
   * @throws `This Evaluation Response already exists, update it instead!`, 400
   * 
   * @returns product initiation instance 
   */
  let evaluationResponse = await checkInstance(
    req, res, EvaluationResponse, this.populateEvaluationResponse, query, "Evaluation Response"
  )
  return evaluationResponse
}
