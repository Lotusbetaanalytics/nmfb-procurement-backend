const asyncHandler = require("../middleware/async");
const ContractEvaluation = require("../models/ContractEvaluation");
const ProjectInitiation = require("../models/ProjectInitiation");
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse");
const {contractEvaluationEmail} = require("../utils/contractEmail");
const {addUserDetails, checkInstance} = require("../utils/queryUtils");


exports.populateContractEvaluation = "contract project projectType evaluatingOfficer businessUsersUnitName createdBy updatedBy"


// @desc    Create ContractEvaluation
// @route  POST /api/v1/contractEvaluation
// @access   Private
exports.createContractEvaluation = asyncHandler(async (req, res, next) => {
  // check for existing contract evaluation
  await this.checkContractEvaluation(req, res, {project: req.body.project})

  // add user details to req.body
  addUserDetails(req)

  if (!req.body.projectTitle || !req.body.projectType) {
    const projectInitiation = await ProjectInitiation.findById(req.body.project);
    req.body.projectTitle = projectInitiation.projectTitle;
    req.body.projectType = projectInitiation.projectType;
  }

  const contractEvaluation = await ContractEvaluation.create(req.body);
  if (!contractEvaluation) {
    return new ErrorResponseJSON(res, "ContractEvaluation not created!", 404);
  }

  /**
   * TODO:
   * PPC portal notifies Front Office/ Admin team member on screen that obligation has been saved successfully
   */
  await contractEvaluationEmail(contractEvaluation, req, res, next);

  return new SuccessResponseJSON(res, contractEvaluation)
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
  const contractEvaluation = await this.checkContractEvaluation(req, res)
  return new SuccessResponseJSON(res, contractEvaluation)
});


// @desc    Update ContractEvaluation
// @route  PATCH /api/v1/contractEvaluation/:id
// @access   Private
exports.updateContractEvaluation = asyncHandler(async (req, res, next) => {
  // add user details to req.body
  addUserDetails(req, true)
  
  const contractEvaluation = await ContractEvaluation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!contractEvaluation) {
    return new ErrorResponseJSON(res, "ContractEvaluation not updated!", 400);
  }

  /**
   * TODO:
   * PPC portal notifies Front Office/ Admin team member on screen that obligation has been saved successfully
   */
  await contractEvaluationEmail(contractEvaluation, req, res, next);

  return new SuccessResponseJSON(res, contractEvaluation)
});


// @desc    Delete ContractEvaluation
// @route  DELETE /api/v1/contractEvaluation
// @access   Private
exports.deleteContractEvaluation = asyncHandler(async (req, res, next) => {
  const contractEvaluation = await ContractEvaluation.findByIdAndDelete(req.params.id);
  if (!contractEvaluation) {
    return new ErrorResponseJSON(res, "ContractEvaluation not found!", 404);
  }
  return new SuccessResponseJSON(res, contractEvaluation)
});


exports.checkContractEvaluation = async (req, res, query = {}) => {
  /**
   * @summary
   *  check if Contract Evaluation instance exists, check if req.params.id exists and perform logic based on that
   * 
   * @throws `Contract Evaluation not Found!`, 404
   * @throws `This Contract Evaluation already exists, update it instead!`, 400
   * 
   * @returns Contract Evaluation instance
   */
  let contractEvaluation = await checkInstance(
    req, res, ContractEvaluation, this.populateContractEvaluation, query, "Contract Evaluation"
  )
  return contractEvaluation
}
