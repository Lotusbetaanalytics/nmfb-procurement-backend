const asyncHandler = require("../middleware/async");
const EvaluationTemplate = require("../models/EvaluationTemplate");
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse");
const {addUserDetails, checkInstance} = require("../utils/queryUtils");


exports.populateEvaluationTemplate = ""


// @desc    Create EvaluationTemplate
// @route  POST /api/v1/evaluationTemplate
// @access   Private
exports.createEvaluationTemplate = asyncHandler(async (req, res, next) => {
  // check for existing evaluation template instance
  await this.checkEvaluationTemplate(req, res, {project: req.body.project})

  const evaluationTemplate = await EvaluationTemplate.create(req.body);
  if (!evaluationTemplate) {
    return new ErrorResponseJSON(res, "EvaluationTemplate not created!", 404);
  }
  return new SuccessResponseJSON(res, evaluationTemplate)
});


// @desc    Get all EvaluationTemplates
// @route  GET /api/v1/evaluationTemplate
// @access   Public
exports.getAllEvaluationTemplates = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});


// @desc    Get EvaluationTemplate
// @route  GET /api/v1/evaluationTemplate/:id
// @access   Private
exports.getEvaluationTemplate = asyncHandler(async (req, res, next) => {
  const evaluationTemplate = await this.checkEvaluationTemplate(req, res)
  return new SuccessResponseJSON(res, evaluationTemplate)
});


// @desc    Update EvaluationTemplate
// @route  PATCH /api/v1/evaluationTemplate/:id
// @access   Private
exports.updateEvaluationTemplate = asyncHandler(async (req, res, next) => {
  const evaluationTemplate = await EvaluationTemplate.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!evaluationTemplate) {
    return new ErrorResponseJSON(res, "EvaluationTemplate not updated!", 400);
  }
  return new SuccessResponseJSON(res, evaluationTemplate)
});


// @desc    Delete EvaluationTemplate
// @route  DELETE /api/v1/evaluationTemplate
// @access   Private
exports.deleteEvaluationTemplate = asyncHandler(async (req, res, next) => {
  const evaluationTemplate = await EvaluationTemplate.findByIdAndDelete(req.params.id);
  if (!evaluationTemplate) {
    return new ErrorResponseJSON(res, "EvaluationTemplate not found!", 404);
  }
  return new SuccessResponseJSON(res, evaluationTemplate)
});


exports.checkEvaluationTemplate = async (req, res, query = {}) => {
  /**
   * @summary
   *  check if Evaluation Template instance exists, check if req.params.id exists and perform logic based on that
   * 
   * @throws `Evaluation Template not Found!`, 404
   * @throws `This Evaluation Template already exists, update it instead!`, 400
   * 
   * @returns Evaluation Template instance
   */
  let evaluationTemplate = await checkInstance(
    req, res, EvaluationTemplate, this.populateEvaluationTemplate, query, "Evaluation Template"
  )
  return evaluationTemplate
}
