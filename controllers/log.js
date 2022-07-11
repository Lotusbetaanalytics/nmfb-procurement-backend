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

const {populateContract} = require("./contract")
const {populateContractEvaluation} = require("./contractEvaluation")
const {populateEvaluationResponse} = require("./evaluationResponse")
const {populateProjectInitiation} = require("./projectInitiation")
const {populateProjectOnboarding} = require("./projectOnboarding")
const {populateProjectTask} = require("./projectTask")
const {populateStaff} = require("./staff")

const {ErrorResponseJSON} = require("../utils/errorResponse");


// @desc    Get All Logs
// @route  GET /api/v1/logs/all
// @access   Private
exports.getAllLogs = asyncHandler(async (req, res, next) => {
  const staff = await Staff.find().populate(populateStaff);
  const roles = await Role.find();
  const teams = await Team.find();

  const contracts = await Contract.find().populate(populateContract);
  const contractTypes = await ContractType.find();
  const budgetLineItems = await BudgetLineItem.find();
  const evaluationResponses = await EvaluationResponse.find().populate(populateEvaluationResponse);
  const evaluationTemplates = await EvaluationTemplate.find();

  const projectTypes = await ProjectType.find();
  const projectCategories = await ProjectCategory.find();

  const contractEvaluation = await ContractEvaluation.find().populate(populateContractEvaluation);
  const contractEvaluationPending = await ContractEvaluation.find({status: "Pending"}).populate(populateContractEvaluation);
  const contractEvaluationStarted = await ContractEvaluation.find({status: "Started"}).populate(populateContractEvaluation);
  const contractEvaluationCompleted = await ContractEvaluation.find({status: "Completed"}).populate(populateContractEvaluation);

  const projectInitiation = await ProjectInitiation.find().populate(populateProjectInitiation);
  const projectInitiationPending = await ProjectInitiation.find({status: "Pending"}).populate(populateProjectInitiation);
  const projectInitiationApproved = await ProjectInitiation.find({status: "Approved"}).populate(populateProjectInitiation);
  const projectInitiationDeclined = await ProjectInitiation.find({status: "Declined"}).populate(populateProjectInitiation);
  const projectInitiationStarted = await ProjectInitiation.find({status: "Started"}).populate(populateProjectInitiation);
  const projectInitiationOnHold = await ProjectInitiation.find({status: "Hold"}).populate(populateProjectInitiation);
  const projectInitiationTerminated = await ProjectInitiation.find({status: "Terminated"}).populate(populateProjectInitiation);
  const projectInitiationCompleted = await ProjectInitiation.find({status: "Completed"}).populate(populateProjectInitiation);
  const projectInitiationOnboarded = await ProjectInitiation.find({isOnboarded: true}).populate(populateProjectInitiation);

  const projectOnboarding = await ProjectOnboarding.find().populate(populateProjectOnboarding);
  const projectOnboardingPending = await ProjectOnboarding.find({status: "Pending"}).populate(populateProjectOnboarding);
  const projectOnboardingStarted = await ProjectOnboarding.find({status: "Started"}).populate(populateProjectOnboarding);
  const projectOnboardingTerminated = await ProjectOnboarding.find({status: "Terminated"}).populate(populateProjectOnboarding);
  const projectOnboardingCompleted = await ProjectOnboarding.find({status: "Completed"}).populate(populateProjectOnboarding);

  const projectTask = await ProjectTask.find().populate(populateProjectTask);
  const projectTaskPending = await ProjectTask.find({status: "Pending"}).populate(populateProjectTask);
  const projectTaskStarted = await ProjectTask.find({status: "Started"}).populate(populateProjectTask);
  const projectTaskReassigned = await ProjectTask.find({status: "Reassigned"}).populate(populateProjectTask);
  const projectTaskOnHold = await ProjectTask.find({status: "On Hold"}).populate(populateProjectTask);
  const projectTaskTerminated = await ProjectTask.find({status: "Terminated"}).populate(populateProjectTask);
  const projectTaskCompleted = await ProjectTask.find({status: "Completed"}).populate(populateProjectTask);

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
});

// TODO: Add controllers and routes for each role
