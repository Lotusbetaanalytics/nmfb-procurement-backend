const asyncHandler = require("../middleware/async");
const BudgetLineItem = require("../models/BudgetLineItem");
const Contract = require("../models/Contract");
const ContractEvaluation = require("../models/ContractEvaluation");
const ContractType = require("../models/ContractType");
const EvaluationTemplate = require("../models/EvaluationTemplate");
const ProjectCategory = require("../models/ProjectCategory");
const ProjectInitiation = require("../models/ProjectInitiation");
const ProjectOnboarding = require("../models/ProjectOnboarding");
const ProjectTask = require("../models/ProjectTask");
const ProjectType = require("../models/ProjectType");
const Role = require("../models/Role");
const Staff = require("../models/Staff");
const Team = require("../models/Team");
const {ErrorResponseJSON} = require("../utils/errorResponse");


// @desc    Get All Logs
// @route  GET /api/v1/logs/all
// @access   Private
exports.getAllLogs = asyncHandler(async (req, res, next) => {
  try {
    const staff = await Staff.find();
    const roles = await Role.find();
    const teams = await Team.find();

    const contracts = await Contract.find();
    const contractTypes = await ContractType.find();
    const budgetLineItems = await BudgetLineItem.find();
    const evaluationTemplates = await EvaluationTemplate.find();

    const projectTypes = await ProjectType.find();
    const projectCategories = await ProjectCategory.find();

    const projectInitiation = await ProjectInitiation.find();
    const projectInitiationPending = await ProjectInitiation.find({status: "Pending"});
    const projectInitiationApproved = await ProjectInitiation.find({status: "Approved"});
    const projectInitiationDeclined = await ProjectInitiation.find({status: "Declined"});
    const projectInitiationStarted = await ProjectInitiation.find({status: "Started"});
    const projectInitiationOnHold = await ProjectInitiation.find({status: "Hold"});
    const projectInitiationTerminated = await ProjectInitiation.find({status: "Terminated"});
    const projectInitiationCompleted = await ProjectInitiation.find({status: "Completed"});
    const projectInitiationOnboarded = await ProjectInitiation.find({isOnboarded: true});

    const projectOnboarding = await ProjectOnboarding.find();
    const projectOnboardingPending = await ProjectOnboarding.find({status: "Pending"});
    const projectOnboardingStarted = await ProjectOnboarding.find({status: "Started"});
    const projectOnboardingTerminated = await ProjectOnboarding.find({status: "Terminated"});
    const projectOnboardingCompleted = await ProjectOnboarding.find({status: "Completed"});

    const projectTask = await ProjectTask.find();
    const projectTaskPending = await ProjectTask.find({status: "Pending"});
    const projectTaskStarted = await ProjectTask.find({status: "Started"});
    const projectTaskReassigned = await ProjectTask.find({status: "Reassigned"});
    const projectTaskOnHold = await ProjectTask.find({status: "On Hold"});
    const projectTaskTerminated = await ProjectTask.find({status: "Terminated"});
    const projectTaskCompleted = await ProjectTask.find({status: "Completed"});

    const contractEvaluation = await ContractEvaluation.find();
    const contractEvaluationPending = await ContractEvaluation.find({status: "Pending"});
    const contractEvaluationStarted = await ContractEvaluation.find({status: "Started"});
    const contractEvaluationCompleted = await ContractEvaluation.find({status: "Completed"});

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
