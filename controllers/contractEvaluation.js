const asyncHandler = require("../middleware/async");
const ContractEvaluation = require("../models/ContractEvaluation");
const ProjectInitiation = require("../models/ProjectInitiation");
const {ErrorResponseJSON} = require("../utils/errorResponse");
const {contractEvaluationEmail} = require("../utils/contractEmail");


// @desc    Create ContractEvaluation
// @route  POST /api/v1/contractEvaluation
// @access   Private
exports.createContractEvaluation = asyncHandler(async (req, res, next) => {
  try {
    const existingContractEvaluation = await ContractEvaluation.find({project: req.body.project});
    const {employeeName, employeeEmail, projectTitle, projectType} = req.body;

    if (existingContractEvaluation.length > 0) {
      return new ErrorResponseJSON(res, "This contractEvaluation already exists, update it instead!", 400);
    }

    if (!employeeName || !employeeEmail) {
      req.body.employeeName = req.user.fullname;
      req.body.employeeEmail = req.user.email;
    }

    if (!projectTitle || !projectType) {
      const projectInitiation = await ProjectInitiation.findById(req.body.project);
      req.body.projectTitle = projectInitiation.projectTitle;
      req.body.projectType = projectInitiation.projectType;
    }

    req.body.createdBy = req.user._id;

    const contractEvaluation = await ContractEvaluation.create(req.body);

    if (!contractEvaluation) {
      return new ErrorResponseJSON(res, "ContractEvaluation not created!", 404);
    }

    /**
     * TODO:
     * PPC portal notifies Front Office/ Admin team member on screen that obligation has been saved successfully
     */
    await contractEvaluationEmail(contractEvaluation, req, res, next);

    res.status(200).json({
      success: true,
      data: contractEvaluation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Get all ContractEvaluations
// @route  GET /api/v1/contractEvaluation
// @access   Public
exports.getAllContractEvaluations = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});


// @desc    Get ContractEvaluation
// @route  GET /api/v1/contractEvaluation/:id
// @access   Private
exports.getContractEvaluation = asyncHandler(async (req, res, next) => {
  try {
    const contractEvaluation = await ContractEvaluation.findById(req.params.id);

    if (!contractEvaluation) {
      return new ErrorResponseJSON(res, "ContractEvaluation not found!", 404);
    }
    res.status(200).json({
      success: true,
      data: contractEvaluation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Update ContractEvaluation
// @route  PATCH /api/v1/contractEvaluation/:id
// @access   Private
exports.updateContractEvaluation = asyncHandler(async (req, res, next) => {
  const contractEvaluation = await ContractEvaluation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!contractEvaluation) {
    return new ErrorResponseJSON(res, "ContractEvaluation not updated!", 400);
  }

  try {
    /**
     * TODO:
     * PPC portal notifies Front Office/ Admin team member on screen that obligation has been saved successfully
     */

    res.status(200).json({
      success: true,
      data: contractEvaluation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Delete ContractEvaluation
// @route  DELETE /api/v1/contractEvaluation
// @access   Private
exports.deleteContractEvaluation = asyncHandler(async (req, res, next) => {
  try {
    const contractEvaluation = await ContractEvaluation.findByIdAndDelete(req.params.id);

    if (!contractEvaluation) {
      return new ErrorResponseJSON(res, "ContractEvaluation not found!", 404);
    }
    res.status(200).json({
      success: true,
      data: contractEvaluation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});
