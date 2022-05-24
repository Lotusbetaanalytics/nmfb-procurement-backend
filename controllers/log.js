const asyncHandler = require("../middleware/async");
const BudgetLineItem = require("../models/BudgetLineItem");
const Contract = require("../models/Contract");
const ContractEvaluation = require("../models/ContractEvaluation");
const ContractType = require("../models/ContractType");
const EvaluationResponse = require("../models/EvaluationResponse");
const EvaluationTemplate = require("../models/EvaluationTemplate");
const ProjectCategory = require("../models/ProjectCategory");
const ProjectInitiation = require("../models/ProjectInitiation");
const ProjectOnboarding = require("../models/ProjectOnboarding");
const ProjectTask = require("../models/ProjectTask");
const ProjectType = require("../models/ProjectType");
const Role = require("../models/Role");
const Staff = require("../models/Staff");
const Team = require("../models/Team");

const {populateContractDetails} = require("./contract")
const {populateContractEvaluationDetails} = require("./contractEvaluation")
const {populateEvaluationResponseDetails} = require("./evaluationResponse")
const {populateProjectInitiationDetails} = require("./projectInitiation")
const {populateProjectOnboardingDetails} = require("./projectOnboarding")
const {populateProjectTaskDetails} = require("./projectTask")
const {populateStaffDetails} = require("./staff")

const {ErrorResponseJSON} = require("../utils/errorResponse");


// @desc    Get All Logs
// @route  GET /api/v1/logs/all
// @access   Private
exports.getAllLogs = asyncHandler(async (req, res, next) => {
  try {
    const staff = await Staff.find().populate(populateStaffDetails);
    const roles = await Role.find();
    const teams = await Team.find();

    const contracts = await Contract.find().populate(populateContractDetails);
    const contractTypes = await ContractType.find();
    const budgetLineItems = await BudgetLineItem.find();
    const evaluationResponses = await EvaluationResponse.find().populate(populateEvaluationResponseDetails);
    const evaluationTemplates = await EvaluationTemplate.find();

    const projectTypes = await ProjectType.find();
    const projectCategories = await ProjectCategory.find();

    const contractEvaluation = await ContractEvaluation.find().populate(populateContractEvaluationDetails);
    const contractEvaluationPending = await ContractEvaluation.find({status: "Pending"}).populate(populateContractEvaluationDetails);
    const contractEvaluationStarted = await ContractEvaluation.find({status: "Started"}).populate(populateContractEvaluationDetails);
    const contractEvaluationCompleted = await ContractEvaluation.find({status: "Completed"}).populate(populateContractEvaluationDetails);

    const projectInitiation = await ProjectInitiation.find().populate(populateProjectInitiationDetails);
    const projectInitiationPending = await ProjectInitiation.find({status: "Pending"}).populate(populateProjectInitiationDetails);
    const projectInitiationApproved = await ProjectInitiation.find({status: "Approved"}).populate(populateProjectInitiationDetails);
    const projectInitiationDeclined = await ProjectInitiation.find({status: "Declined"}).populate(populateProjectInitiationDetails);
    const projectInitiationStarted = await ProjectInitiation.find({status: "Started"}).populate(populateProjectInitiationDetails);
    const projectInitiationOnHold = await ProjectInitiation.find({status: "Hold"}).populate(populateProjectInitiationDetails);
    const projectInitiationTerminated = await ProjectInitiation.find({status: "Terminated"}).populate(populateProjectInitiationDetails);
    const projectInitiationCompleted = await ProjectInitiation.find({status: "Completed"}).populate(populateProjectInitiationDetails);
    const projectInitiationOnboarded = await ProjectInitiation.find({isOnboarded: true}).populate(populateProjectInitiationDetails);

    const projectOnboarding = await ProjectOnboarding.find().populate(populateProjectOnboardingDetails);
    const projectOnboardingPending = await ProjectOnboarding.find({status: "Pending"}).populate(populateProjectOnboardingDetails);
    const projectOnboardingStarted = await ProjectOnboarding.find({status: "Started"}).populate(populateProjectOnboardingDetails);
    const projectOnboardingTerminated = await ProjectOnboarding.find({status: "Terminated"}).populate(populateProjectOnboardingDetails);
    const projectOnboardingCompleted = await ProjectOnboarding.find({status: "Completed"}).populate(populateProjectOnboardingDetails);

    const projectTask = await ProjectTask.find().populate(populateProjectTaskDetails);
    const projectTaskPending = await ProjectTask.find({status: "Pending"}).populate(populateProjectTaskDetails);
    const projectTaskStarted = await ProjectTask.find({status: "Started"}).populate(populateProjectTaskDetails);
    const projectTaskReassigned = await ProjectTask.find({status: "Reassigned"}).populate(populateProjectTaskDetails);
    const projectTaskOnHold = await ProjectTask.find({status: "On Hold"}).populate(populateProjectTaskDetails);
    const projectTaskTerminated = await ProjectTask.find({status: "Terminated"}).populate(populateProjectTaskDetails);
    const projectTaskCompleted = await ProjectTask.find({status: "Completed"}).populate(populateProjectTaskDetails);

    // if (!projectInitiation) {
    //   return new ErrorResponseJSON(res, "Logs not found!", 404);
    // }

    res.status(200).json({
      success: true,
      data: {
        staff,
        roles,
        teams,
        contracts,
        contractTypes,
        budgetLineItems,
        evaluationResponses,
        evaluationTemplates,
        projectTypes,
        projectCategories,
        projectInitiation,
        projectInitiationPending,
        projectInitiationApproved,
        projectInitiationDeclined,
        projectInitiationStarted,
        projectInitiationOnHold,
        projectInitiationTerminated,
        projectInitiationCompleted,
        projectInitiationOnboarded,
        projectOnboarding,
        projectOnboardingPending,
        projectOnboardingStarted,
        projectOnboardingTerminated,
        projectOnboardingCompleted,
        projectTask,
        projectTaskPending,
        projectTaskStarted,
        projectTaskReassigned,
        projectTaskOnHold,
        projectTaskTerminated,
        projectTaskCompleted,
        contractEvaluation,
        contractEvaluationPending,
        contractEvaluationStarted,
        contractEvaluationCompleted,
      },
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});

// TODO: Add controllers and routes for each role
