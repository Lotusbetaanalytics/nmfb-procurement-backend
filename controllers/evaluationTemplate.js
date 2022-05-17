const asyncHandler = require("../middleware/async");
const EvaluationTemplate = require("../models/EvaluationTemplate");
const {ErrorResponseJSON} = require("../utils/errorResponse");


// @desc    Create EvaluationTemplate
// @route  POST /api/v1/evaluationTemplate
// @access   Private
exports.createEvaluationTemplate = asyncHandler(async (req, res, next) => {
  try {
    const existingEvaluationTemplate = await EvaluationTemplate.find({project: req.body.project});

    if (existingEvaluationTemplate.length > 0) {
      return new ErrorResponseJSON(res, "This evaluationTemplate already exists, update it instead!", 400);
    }

    const evaluationTemplate = await EvaluationTemplate.create(req.body);

    if (!evaluationTemplate) {
      return new ErrorResponseJSON(res, "EvaluationTemplate not created!", 404);
    }
    res.status(200).json({
      success: true,
      data: evaluationTemplate,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
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
  const evaluationTemplate = await EvaluationTemplate.findById(req.params.id);

  if (!evaluationTemplate) {
    return new ErrorResponseJSON(res, "EvaluationTemplate not found!", 404);
  }

  try {
    res.status(200).json({
      success: true,
      data: evaluationTemplate,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
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

  try {
    res.status(200).json({
      success: true,
      data: evaluationTemplate,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Delete EvaluationTemplate
// @route  DELETE /api/v1/evaluationTemplate
// @access   Private
exports.deleteEvaluationTemplate = asyncHandler(async (req, res, next) => {
  const evaluationTemplate = await EvaluationTemplate.findByIdAndDelete(req.params.id);

  if (!evaluationTemplate) {
    return new ErrorResponseJSON(res, "EvaluationTemplate not found!", 404);
  }

  try {
    res.status(200).json({
      success: true,
      data: evaluationTemplate,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});
