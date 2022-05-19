const asyncHandler = require("../middleware/async");
const ProjectInitiation = require("../models/ProjectInitiation");
const ProjectTask = require("../models/ProjectTask");
const {ErrorResponseJSON} = require("../utils/errorResponse");
const { uploadProjectDocuments } = require("../utils/fileUtils");
const {projectInitiationEmail, projectInitiationUpdateEmail} = require("../utils/projectEmail");
const {generateProjectId} = require("../utils/projectUtils")


// @desc    Create ProjectInitiation
// @route  POST /api/v1/projectInitiation
// @access   Private
exports.createProjectInitiation = asyncHandler(async (req, res, next) => {
  try {
    const existingProjectInitiation = await ProjectInitiation.find({projectTitle: req.body.projectTitle})
      .populate("contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy");

    if (existingProjectInitiation.length > 0) {
      return new ErrorResponseJSON(res, "This projectInitiation already exists, update it instead!", 400);
    }

    req.body.name = req.user.fullname;
    req.body.email = req.user.email;
    req.body.createdBy = req.user._id;

    if (req.user.role.title == "Head of Procurement") {
      req.body.headOfProcurement = req.user._id;
    } else if (req.user.role.title == "Admin" || req.user.role.title == "Front Desk Officer") {
      req.body.frontDeskOfficer = req.user._id;
    } else if (req.user.role.title == "Super Admin") {
      // do nothing
    } else {
      return new ErrorResponseJSON(res, `You are not authorized to create projects!. Role is ${req.user.role.title}`, 404);
    }

    const projectInitiation = await ProjectInitiation.create(req.body);

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not created!", 404);
    }
    
    // // TODO: Generate project ID
    // projectInitiation.projectId = await generateProjectId(projectInitiation)
    // console.log(`projectInitiation.projectId: ${projectInitiation.projectId}`)
    // await projectInitiation.save()

    /**
     * TODO:
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
      .populate("contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy");

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

    // TODO: Generate project ID
    if (!projectInitiation.projectId)
      projectInitiation.projectId = await generateProjectId(projectInitiation);
      await projectInitiation.save()

    /**
     * TODO:
     * Post-conditions (Depending on the ProjectInitiation status):
     * • The PPC portal shall send successful update of project email notification to the head of procurement
     * • The PPC portal shall send a update project email notification to the project desk officer
     * • The system shall send email notification to the front office /admin to upload or review documents.
     * */
    await projectInitiationUpdateEmail(projectInitiation, req, res, next);

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
      .populate("contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy");

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
      .populate("contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy");

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


// TODO: Add update status endpoints
// @desc    Update ProjectInitiation Status
// @route  PATCH /api/v1/projectInitiation/:id/status
// @access   Private
exports.updateProjectInitiationStatus = asyncHandler(async (req, res, next) => {
  try {
    existingProjectInitiation = await ProjectInitiation.findById(req.params.id
        .populate("contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy"))
    
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
     * TODO:
     * Post-conditions (Depending on the ProjectInitiation status):
     * • The PPC portal shall send successful update of project email notification to the head of procurement
     * • The PPC portal shall send a update project email notification to the project desk officer
     * • The system shall send email notification to the front office /admin to upload or review documents.
     * */
    await projectInitiationUpdateEmail(projectInitiation, req, res, next);

    res.status(200).json({
      success: true,
      data: projectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});


// @desc    Upload ProjectInitiation Documents
// @route  PATCH /api/v1/projectInitiation/:id/upload
// @access   Private
exports.uploadProjectInitiationDocuments = asyncHandler(async (req, res, next) => {
  try {

    const {file} = req
    if (!file) return new ErrorResponseJSON(res, "No files provided!", 400);

    const projectInitiation = await ProjectInitiation.findById(req.params.id)
      .populate("contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy");

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not found!", 404);
    }

    const documentLinks = uploadProjectDocuments(req, res, projectInitiation, file)
    projectInitiation.files = documentLinks
    await projectInitiation.save()

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
      .populate("contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy");

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
      .populate("contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy");

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
      .populate("contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy");

    if (terminatedProjectInitiation.length < 1) {
      return new ErrorResponseJSON(res, "Terminated ProjectInitiations not found!", 404);
    }
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
      .populate("contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy");

    if (pendingProjectInitiation.length < 1) {
      return new ErrorResponseJSON(res, "Pending ProjectInitiations not found!", 404);
    }
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
      .populate("contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy");

    if (completedProjectInitiation.length < 1) {
      return new ErrorResponseJSON(res, "Completed ProjectInitiations not found!", 404);
    }
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
      .populate("contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy");

    if (approvedProjectInitiation.length < 1) {
      return new ErrorResponseJSON(res, "Approved ProjectInitiations not found!", 404);
    }
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
      .populate("contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy");

    if (declinedProjectInitiation.length < 1) {
      return new ErrorResponseJSON(res, "Declined ProjectInitiations not found!", 404);
    }
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
      .populate("contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy");

    if (onHoldProjectInitiation.length < 1) {
      return new ErrorResponseJSON(res, "On Hold ProjectInitiations not found!", 404);
    }
    res.status(200).json({
      success: true,
      data: onHoldProjectInitiation,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
});
