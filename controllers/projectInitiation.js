const asyncHandler = require("../middleware/async");
// const CostEstimationDocuments = require("../models/CostEstimationDocuments");
const ProjectInitiation = require("../models/ProjectInitiation");
const ProjectStage = require("../models/ProjectStage");
const ProjectTask = require("../models/ProjectTask");
const SupportingDocuments = require("../models/SupportingDocuments");
const {ErrorResponseJSON} = require("../utils/errorResponse");
const { uploadProjectDocuments } = require("../utils/fileUtils");
const {
  projectAssignmentEmail,
  projectInitiationEmail, 
  projectInitiationUpdateEmail,
  projectCostEstimationEmail,
} = require("../utils/projectEmail");
const {generateProjectId} = require("../utils/projectUtils")


exports.populateProjectInitiationDetails = "contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy"


// @desc    Create ProjectInitiation
// @route  POST /api/v1/projectInitiation
// @access   Private
exports.createProjectInitiation = asyncHandler(async (req, res, next) => {
  try {
    console.log(req.body)
    const existingProjectInitiation = await ProjectInitiation.find({projectTitle: req.body.projectTitle})
      .populate(this.populateProjectInitiationDetails);

    if (existingProjectInitiation.length > 0) {
      return new ErrorResponseJSON(res, "This projectInitiation already exists, update it instead!", 400);
    }

    req.body.name = req.user.fullname;
    req.body.email = req.user.email;
    req.body.createdBy = req.user._id;
    console.log(req.body)
    if (req.user.role.title == "Head of Procurement") {
      req.body.headOfProcurement = req.user._id;
    } else if (req.user.role.title == "Admin" || req.user.role.title == "Frontdesk") {
      req.body.frontDeskOfficer = req.user._id;
    } else if (req.user.role.title == "Super Admin") {
      // do nothing
    } else {
      return new ErrorResponseJSON(res, `You are not authorized to initiate projects!. Role is ${req.user.role.title}`, 404);
    }
    console.log(req.body)
    const projectInitiation = await ProjectInitiation.create(req.body);

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not created!", 404);
    }
    
    // // DONE: Generate project ID
    // projectInitiation.projectId = await generateProjectId(projectInitiation)
    // console.log(`projectInitiation.projectId: ${projectInitiation.projectId}`)
    // await projectInitiation.save()

    /**
     * DONE:
     * Post-conditions:
     * • The PPC portal shall send successful initiation project email notification to the head of procurement
     * • The PPC portal shall send a new project email notification to the project desk officer
     * • The system shall send email notification to the front office /admin to upload or review documents.
     * */
    await projectInitiationEmail(projectInitiation, req, res, next);

    res.status(200).json({
      success: true,
      data: projectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Get all ProjectInitiations
// @route  GET /api/v1/projectInitiation
// @access   Public
exports.getAllProjectInitiations = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});


// @desc    Get ProjectInitiation
// @route  GET /api/v1/projectInitiation/:id
// @access   Private
exports.getProjectInitiation = asyncHandler(async (req, res, next) => {
  try {
    const projectInitiation = await ProjectInitiation.findById(req.params.id)
      .populate(this.populateProjectInitiationDetails);

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not found!", 404);
    }
    res.status(200).json({
      success: true,
      data: projectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Update ProjectInitiation
// @route  PATCH /api/v1/projectInitiation/:id
// @access   Private
exports.updateProjectInitiation = asyncHandler(async (req, res, next) => {
  try {
    req.body.updatedBy = req.user._id;
    req.body.updatedAt = Date.now();

    const projectInitiation = await ProjectInitiation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not updated!", 400);
    }

    // DONE: Generate project ID
    // TODO: Fix naming bug in project ID
    if (!projectInitiation.projectId)
      projectInitiation.projectId = await generateProjectId(projectInitiation);
      await projectInitiation.save()

    /**
     * DONE:
     * Post-conditions (Depending on the ProjectInitiation status):
     * • The PPC portal shall send successful update of project email notification to the head of procurement
     * • The PPC portal shall send a update project email notification to the project desk officer
     * • The system shall send email notification to the front office /admin to upload or review documents.
     * */
    await projectInitiationEmail(projectInitiation, true, req, res, next);

    res.status(200).json({
      success: true,
      data: projectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Delete ProjectInitiation
// @route  DELETE /api/v1/projectInitiation
// @access   Private
exports.deleteProjectInitiation = asyncHandler(async (req, res, next) => {
  try {
    const projectInitiation = await ProjectInitiation.findByIdAndDelete(req.params.id);

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not found!", 404);
    }
    res.status(200).json({
      success: true,
      data: projectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Approve ProjectInitiation
// @route  GET /api/v1/projectInitiation/:id/approve
// @access   Private
exports.approveProjectInitiation = asyncHandler(async (req, res, next) => {
  try {
    const projectInitiation = await ProjectInitiation.findById(req.params.id)
      .populate(this.populateProjectInitiationDetails);

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not found!", 404);
    }

    projectInitiation.status = "Approved";
    projectInitiation.isOnboarede = true;
    projectInitiation.save();

    res.status(200).json({
      success: true,
      data: projectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Decline ProjectInitiation
// @route  GET /api/v1/projectInitiation/:id/decline
// @access   Private
exports.declineProjectInitiation = asyncHandler(async (req, res, next) => {
  try {
    const projectInitiation = await ProjectInitiation.findById(req.params.id)
      .populate(this.populateProjectInitiationDetails);

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not found!", 404);
    }

    projectInitiation.status = "Declined";
    projectInitiation.save();

    res.status(200).json({
      success: true,
      data: projectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Assign Project to Responsible officer
// @route  PATCH /api/v1/projectInitiation/:id/assign
// @access   Private
exports.assignProject = asyncHandler(async (req, res, next) => {
  try {
    const existingProjectInitiation = await ProjectInitiation.findById(req.params.id).populate(
      this.populateProjectInitiation
    );

    if (!existingProjectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not found!", 404);
    }

    // req.body.assignedBy = req.user._id;
    // req.body.assignedTo = req.body.responsibleOfficer;

    const projectInitiation = await ProjectInitiation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not updated!", 400);
    }

    await projectAssignmentEmail(projectInitiation);

    res.status(200).json({
      success: true,
      data: projectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// DONE: Add update status endpoints
// @desc    Update ProjectInitiation Status
// @route  PATCH /api/v1/projectInitiation/:id/status
// @access   Private
exports.updateProjectInitiationStatus = asyncHandler(async (req, res, next) => {
  try {
    existingProjectInitiation = await ProjectInitiation.findById(req.params.id
        .populate(this.populateProjectInitiationDetails))
    
    req.body.updatedBy = req.user._id;
    req.body.updatedAt = Date.now();

    const {status} = req.body

    const projectInitiation = await ProjectInitiation.findByIdAndUpdate(req.params.id, {status}, {
      new: true,
      runValidators: true,
    });

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not updated!", 400);
    }

    /**
     * DONE:
     * Post-conditions (Depending on the ProjectInitiation status):
     * • The PPC portal shall send successful update of project email notification to the head of procurement
     * • The PPC portal shall send a update project email notification to the project desk officer
     * • The system shall send email notification to the front office /admin to upload or review documents.
     * */
    await projectInitiationEmail(projectInitiation, true, req, res, next);

    res.status(200).json({
      success: true,
      data: projectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// TODO: Update this to use supporting documents
// @desc    Upload ProjectInitiation Documents
// @route  PATCH /api/v1/projectInitiation/:id/upload
// @access   Private
exports.uploadProjectInitiationDocuments = asyncHandler(async (req, res, next) => {
  try {

    const {file} = req
    if (!file) return new ErrorResponseJSON(res, "No files provided!", 400);

    const projectInitiation = await ProjectInitiation.findById(req.params.id)
      .populate(this.populateProjectInitiationDetails);

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not found!", 404);
    }

    const documentLinks = uploadProjectDocuments(req, res, projectInitiation, file)
    // projectInitiation.files = documentLinks
    projectInitiation.files.append(documentLinks)
    await projectInitiation.save()

    res.status(200).json({
      success: true,
      data: projectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// TODO: Update this to use supporting documents
// @desc    Upload ProjectInitiation TechnicalSpecification Documents
// @route  POST /api/v1/projectInitiation/:id/technicalSpecification
// @access   Private
exports.uploadProjectInitiationTechnicalSpecificationDocuments = asyncHandler(async (req, res, next) => {
  try {

    const {file} = req
    if (!file) return new ErrorResponseJSON(res, "No files provided!", 400);

    const projectInitiation = await ProjectInitiation.findById(req.params.id)
      .populate(this.populateProjectInitiationDetails);

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not found!", 404);
    }

    const projectStage = await ProjectStage.findOne({title: "SCOPE/TOR/TECHNICAL SPECIFICATION"})

    const payload = {
      employeeName: req.user.fullname,
      employeeEmail: req.user.email,
      project: projectInitiation._id,
      projectTitle: projectInitiation.title,
      projectStage: projectStage,
      documentType: req.body.documentType,
      documentName: req.body.documentName,
      files: req.body.files,
      memo: req.body.memo,
      description: req.body.description,

    }
    const technicalSpecification = await SupportingDocuments.create(payload)

    if (!technicalSpecification) {
      return new ErrorResponseJSON(res, "Technical Specification Documents not uploaded!", 400 );
    }

    const folder = "Technical Specification"
    const documentLinks = uploadProjectDocuments(req, res, projectInitiation, file, folder)
    // projectInitiation.files = documentLinks
    projectInitiation.files.append(documentLinks)
    await projectInitiation.save()

    /**
     * TODO:
     * PPC portal sends email notification notifying the PDO to take action on the ‘selection method ‘ stage
     */

    await projectTechnicalSpecificationEmail(projectInitiation, req, res, next)

    res.status(200).json({
      success: true,
      data: projectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Upload ProjectInitiation CostEstimation Documents
// @route  POST /api/v1/projectInitiation/:id/costEstimation
// @access   Private
exports.uploadProjectInitiationCostEstimationDocuments = asyncHandler(async (req, res, next) => {
  try {

    const {file} = req
    if (!file) return new ErrorResponseJSON(res, "No files provided!", 400);

    const projectInitiation = await ProjectInitiation.findById(req.params.id)
      .populate(this.populateProjectInitiationDetails);

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not found!", 404);
    }

    const projectStage = await ProjectStage.findOne({title: "COST ESTIMATION"})

    const payload = {
      employeeName: req.user.fullname,
      employeeEmail: req.user.email,
      project: projectInitiation._id,
      projectTitle: projectInitiation.title,
      projectStage: projectStage,
      documentType: req.body.documentType,
      documentName: req.body.documentName,
      files: req.body.files,
      memo: req.body.memo,
      description: req.body.description,

    }
    const costEstimation = await SupportingDocuments.create(payload)

    if (!costEstimation) {
      return new ErrorResponseJSON(res, "Cost Estimation Documents not uploaded!", 400 );
    }

    const folder = "Cost Estimation"
    const documentLinks = uploadProjectDocuments(req, res, projectInitiation, file, folder)
    // projectInitiation.files = documentLinks
    projectInitiation.files.append(documentLinks)
    await projectInitiation.save()

    /**
     * TODO:
     * PPC portal sends email notification notifying the PDO to take action on the ‘selection method ‘ stage
     */

    await projectCostEstimationEmail(projectInitiation, req, res, next)

    res.status(200).json({
      success: true,
      data: projectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Upload ProjectInitiation SelectionMethod Documents
// @route  POST /api/v1/projectInitiation/:id/selectionMethod
// @access   Private
exports.uploadProjectInitiationSelectionMethodDocuments = asyncHandler(async (req, res, next) => {
  try {

    const {file} = req
    if (!file) return new ErrorResponseJSON(res, "No files provided!", 400);

    const projectInitiation = await ProjectInitiation.findById(req.params.id)
      .populate(this.populateProjectInitiationDetails);

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not found!", 404);
    }

    const projectStage = await ProjectStage.findOne({title: "SELECTION METHOD"})

    const payload = {
      employeeName: req.user.fullname,
      employeeEmail: req.user.email,
      project: projectInitiation._id,
      projectTitle: projectInitiation.title,
      projectStage: projectStage,
      documentType: req.body.documentType,
      documentName: req.body.documentName,
      files: req.body.files,
      memo: req.body.memo,
      description: req.body.description,

    }
    const selectionMethod = await SupportingDocuments.create(payload)

    if (!selectionMethod) {
      return new ErrorResponseJSON(res, "Selection Method Documents not uploaded!", 400 );
    }

    const folder = "Selection Method"
    const documentLinks = uploadProjectDocuments(req, res, projectInitiation, file, folder)
    // projectInitiation.files = documentLinks
    projectInitiation.files.append(documentLinks)
    await projectInitiation.save()

    /**
     * TODO:
     * PPC portal sends email notification notifying the PDO to take action on the ‘selection method ‘ stage
     */

    await projectSelectionMethodEmail(projectInitiation, req, res, next)

    res.status(200).json({
      success: true,
      data: projectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Upload ProjectInitiation NoObjection Documents
// @route  POST /api/v1/projectInitiation/:id/noObjection
// @access   Private
exports.uploadProjectInitiationNoObjectionDocuments = asyncHandler(async (req, res, next) => {
  try {

    const {file} = req
    if (!file) return new ErrorResponseJSON(res, "No files provided!", 400);

    const projectInitiation = await ProjectInitiation.findById(req.params.id)
      .populate(this.populateProjectInitiationDetails);

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not found!", 404);
    }

    const projectStage = await ProjectStage.findOne({title: "NO OBJECTION"})

    const payload = {
      employeeName: req.user.fullname,
      employeeEmail: req.user.email,
      project: projectInitiation._id,
      projectTitle: projectInitiation.title,
      projectStage: projectStage,
      documentType: req.body.documentType,
      documentName: req.body.documentName,
      files: req.body.files,
      memo: req.body.memo,
      description: req.body.description,

    }
    const noObjection = await SupportingDocuments.create(payload)

    if (!noObjection) {
      return new ErrorResponseJSON(res, "No Objection Documents not uploaded!", 400 );
    }

    const folder = "No Objection"
    const documentLinks = uploadProjectDocuments(req, res, projectInitiation, file, folder)
    // projectInitiation.files = documentLinks
    projectInitiation.files.append(documentLinks)
    await projectInitiation.save()

    /**
     * TODO:
     * PPC portal sends email notification notifying the PDO to take action on the ‘selection method ‘ stage
     */

    await projectNoObjectionEmail(projectInitiation, req, res, next)

    res.status(200).json({
      success: true,
      data: projectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Upload ProjectInitiation IssuanceOfSPN Documents
// @route  POST /api/v1/projectInitiation/:id/issuanceOfSPN
// @access   Private
exports.uploadProjectInitiationIssuanceOfSPNDocuments = asyncHandler(async (req, res, next) => {
  try {

    const {file} = req
    if (!file) return new ErrorResponseJSON(res, "No files provided!", 400);

    const projectInitiation = await ProjectInitiation.findById(req.params.id)
      .populate(this.populateProjectInitiationDetails);

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not found!", 404);
    }

    const projectStage = await ProjectStage.findOne({title: "ISSUANCE OF SPN"})

    const payload = {
      employeeName: req.user.fullname,
      employeeEmail: req.user.email,
      project: projectInitiation._id,
      projectTitle: projectInitiation.title,
      projectStage: projectStage,
      documentType: req.body.documentType,
      documentName: req.body.documentName,
      files: req.body.files,
      memo: req.body.memo,
      description: req.body.description,

    }
    const issuanceOfSPN = await SupportingDocuments.create(payload)

    if (!issuanceOfSPN) {
      return new ErrorResponseJSON(res, "Issuance Of SPN Documents not uploaded!", 400 );
    }

    const folder = "Issuance Of SPN"
    const documentLinks = uploadProjectDocuments(req, res, projectInitiation, file, folder)
    // projectInitiation.files = documentLinks
    projectInitiation.files.append(documentLinks)
    await projectInitiation.save()

    /**
     * TODO:
     * PPC portal sends email notification notifying the PDO to take action on the ‘selection method ‘ stage
     */

    await projectIssuanceOfSPNEmail(projectInitiation, req, res, next)

    res.status(200).json({
      success: true,
      data: projectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Upload ProjectInitiation SubmissionOfProposals Documents
// @route  POST /api/v1/projectInitiation/:id/submissionOfProposals
// @access   Private
exports.uploadProjectInitiationSubmissionOfProposalsDocuments = asyncHandler(async (req, res, next) => {
  try {

    const {file} = req
    if (!file) return new ErrorResponseJSON(res, "No files provided!", 400);

    const projectInitiation = await ProjectInitiation.findById(req.params.id)
      .populate(this.populateProjectInitiationDetails);

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not found!", 404);
    }

    const projectStage = await ProjectStage.findOne({title: "SUBMISSION OF PROPOSALS"})

    const payload = {
      employeeName: req.user.fullname,
      employeeEmail: req.user.email,
      project: projectInitiation._id,
      projectTitle: projectInitiation.title,
      projectStage: projectStage,
      documentType: req.body.documentType,
      documentName: req.body.documentName,
      files: req.body.files,
      memo: req.body.memo,
      description: req.body.description,

    }
    const submissionOfProposals = await SupportingDocuments.create(payload)

    if (!submissionOfProposals) {
      return new ErrorResponseJSON(res, "Submission Of Proposals Documents not uploaded!", 400 );
    }

    const folder = "Submission Of Proposals"
    const documentLinks = uploadProjectDocuments(req, res, projectInitiation, file, folder)
    // projectInitiation.files = documentLinks
    projectInitiation.files.append(documentLinks)
    await projectInitiation.save()

    /**
     * TODO:
     * PPC portal sends email notification notifying the PDO to take action on the ‘selection method ‘ stage
     */

    await projectSubmissionOfProposalsEmail(projectInitiation, req, res, next)

    res.status(200).json({
      success: true,
      data: projectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Upload ProjectInitiation BidOpeningExercise Documents
// @route  POST /api/v1/projectInitiation/:id/bidOpeningExercise
// @access   Private
exports.uploadProjectInitiationBidOpeningExerciseDocuments = asyncHandler(async (req, res, next) => {
  try {

    const {file} = req
    if (!file) return new ErrorResponseJSON(res, "No files provided!", 400);

    const projectInitiation = await ProjectInitiation.findById(req.params.id)
      .populate(this.populateProjectInitiationDetails);

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not found!", 404);
    }

    const projectStage = await ProjectStage.findOne({title: "BID OPENING EXERCISE"})

    const payload = {
      employeeName: req.user.fullname,
      employeeEmail: req.user.email,
      project: projectInitiation._id,
      projectTitle: projectInitiation.title,
      projectStage: projectStage,
      documentType: req.body.documentType,
      documentName: req.body.documentName,
      files: req.body.files,
      memo: req.body.memo,
      description: req.body.description,

    }
    const bidOpeningExercise = await SupportingDocuments.create(payload)

    if (!bidOpeningExercise) {
      return new ErrorResponseJSON(res, "Bid Opening Exercise Documents not uploaded!", 400 );
    }

    const folder = "Bid Opening Exercise"
    const documentLinks = uploadProjectDocuments(req, res, projectInitiation, file, folder)
    // projectInitiation.files = documentLinks
    projectInitiation.files.append(documentLinks)
    await projectInitiation.save()

    /**
     * TODO:
     * PPC portal sends email notification notifying the PDO to take action on the ‘selection method ‘ stage
     */

    await projectBidOpeningExerciseEmail(projectInitiation, req, res, next)

    res.status(200).json({
      success: true,
      data: projectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Upload ProjectInitiation BidEvaluation Documents
// @route  POST /api/v1/projectInitiation/:id/bidEvaluation
// @access   Private
exports.uploadProjectInitiationBidEvaluationDocuments = asyncHandler(async (req, res, next) => {
  try {

    const {file} = req
    if (!file) return new ErrorResponseJSON(res, "No files provided!", 400);

    const projectInitiation = await ProjectInitiation.findById(req.params.id)
      .populate(this.populateProjectInitiationDetails);

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not found!", 404);
    }

    const projectStage = await ProjectStage.findOne({title: "EVALUATION OF BID OPENING EXERCISE"})

    const payload = {
      employeeName: req.user.fullname,
      employeeEmail: req.user.email,
      project: projectInitiation._id,
      projectTitle: projectInitiation.title,
      projectStage: projectStage,
      documentType: req.body.documentType,
      documentName: req.body.documentName,
      files: req.body.files,
      memo: req.body.memo,
      description: req.body.description,

    }
    const bidEvaluation = await SupportingDocuments.create(payload)

    if (!bidEvaluation) {
      return new ErrorResponseJSON(res, "Bid Evaluation Documents not uploaded!", 400 );
    }

    const folder = "Bid Evaluation"
    const documentLinks = uploadProjectDocuments(req, res, projectInitiation, file, folder)
    // projectInitiation.files = documentLinks
    projectInitiation.files.append(documentLinks)
    await projectInitiation.save()

    /**
     * TODO:
     * PPC portal sends email notification notifying the PDO to take action on the ‘selection method ‘ stage
     */

    await projectBidEvaluationEmail(projectInitiation, req, res, next)

    res.status(200).json({
      success: true,
      data: projectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Get ProjectInitiation Tasks
// @route  GET /api/v1/projectInitiation/:id/tasks
// @access   Private
exports.getProjectInitiationTasks = asyncHandler(async (req, res, next) => {
  try {
    const projectInitiation = await ProjectInitiation.findById(req.params.id)
      .populate(this.populateProjectInitiationDetails);

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not found!", 404);
    }

    const projectTasks = await ProjectTask.find({project: req.params.id});

    res.status(200).json({
      success: true,
      project: projectInitiation,
      data: projectTasks,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Get all Started ProjectInitiations
// @route  GET /api/v1/projectInitiation/started
// @access   Public
exports.getAllStartedProjectInitiations = asyncHandler(async (req, res, next) => {
  try {
    const startedProjectInitiation = await ProjectInitiation.find({status: "Started"})
      .populate(this.populateProjectInitiationDetails);

    if (startedProjectInitiation.length < 1) {
      return new ErrorResponseJSON(res, "Started ProjectInitiations not found!", 404);
    }
    res.status(200).json({
      success: true,
      data: startedProjectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Get all Terminated ProjectInitiations
// @route  GET /api/v1/projectInitiation/terminated
// @access   Public
exports.getAllTerminatedProjectInitiations = asyncHandler(async (req, res, next) => {
  try {
    const terminatedProjectInitiation = await ProjectInitiation.find({status: "Terminated"})
      .populate(this.populateProjectInitiationDetails);

    // if (terminatedProjectInitiation.length < 1) {
    //   return new ErrorResponseJSON(res, "Terminated ProjectInitiations not found!", 404);
    // }
    res.status(200).json({
      success: true,
      data: terminatedProjectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Get all Pending ProjectInitiations
// @route  GET /api/v1/projectInitiation/pending
// @access   Public
exports.getAllPendingProjectInitiations = asyncHandler(async (req, res, next) => {
  try {
    const pendingProjectInitiation = await ProjectInitiation.find({status: "Pending"})
      .populate(this.populateProjectInitiationDetails);

    // if (pendingProjectInitiation.length < 1) {
    //   return new ErrorResponseJSON(res, "Pending ProjectInitiations not found!", 404);
    // }
    res.status(200).json({
      success: true,
      data: pendingProjectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Get all Completed ProjectInitiations
// @route  GET /api/v1/projectInitiation/completed
// @access   Public
exports.getAllCompletedProjectInitiations = asyncHandler(async (req, res, next) => {
  try {
    const completedProjectInitiation = await ProjectInitiation.find({status: "Completed"})
      .populate(this.populateProjectInitiationDetails);

    // if (completedProjectInitiation.length < 1) {
    //   return new ErrorResponseJSON(res, "Completed ProjectInitiations not found!", 404);
    // }
    res.status(200).json({
      success: true,
      data: completedProjectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Get all Approved ProjectInitiations
// @route  GET /api/v1/projectInitiation/approved
// @access   Public
exports.getAllApprovedProjectInitiations = asyncHandler(async (req, res, next) => {
  try {
    const approvedProjectInitiation = await ProjectInitiation.find({status: "Approved"})
      .populate(this.populateProjectInitiationDetails);

    // if (approvedProjectInitiation.length < 1) {
    //   return new ErrorResponseJSON(res, "Approved ProjectInitiations not found!", 404);
    // }
    res.status(200).json({
      success: true,
      data: approvedProjectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Get all Declined ProjectInitiations
// @route  GET /api/v1/projectInitiation/declined
// @access   Public
exports.getAllDeclinedProjectInitiations = asyncHandler(async (req, res, next) => {
  try {
    const declinedProjectInitiation = await ProjectInitiation.find({status: "Declined"})
      .populate(this.populateProjectInitiationDetails);

    // if (declinedProjectInitiation.length < 1) {
    //   return new ErrorResponseJSON(res, "Declined ProjectInitiations not found!", 404);
    // }
    res.status(200).json({
      success: true,
      data: declinedProjectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Get all On Hold ProjectInitiations
// @route  GET /api/v1/projectInitiation/onHold
// @access   Public
exports.getAllOnHoldProjectInitiations = asyncHandler(async (req, res, next) => {
  try {
    const onHoldProjectInitiation = await ProjectInitiation.find({status: "On Hold"})
      .populate(this.populateProjectInitiationDetails);

    // if (onHoldProjectInitiation.length < 1) {
    //   return new ErrorResponseJSON(res, "On Hold ProjectInitiations not found!", 404);
    // }
    res.status(200).json({
      success: true,
      data: onHoldProjectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});
