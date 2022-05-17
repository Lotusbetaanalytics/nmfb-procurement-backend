const asyncHandler = require("../middleware/async");
const ProjectInitiation = require("../models/ProjectInitiation");
const ProjectTask = require("../models/ProjectTask");
const {ErrorResponseJSON} = require("../utils/errorResponse");
const {projectInitiationEmail, projectInitiationUpdateEmail} = require("../utils/projectEmail");


// @desc    Create ProjectInitiation
// @route  POST /api/v1/projectInitiation
// @access   Private
exports.createProjectInitiation = asyncHandler(async (req, res, next) => {
  try {
    const existingProjectInitiation = await ProjectInitiation.find({projectTitle: req.body.projectTitle});

    if (existingProjectInitiation.length > 0) {
      return new ErrorResponseJSON(res, "This projectInitiation already exists, update it instead!", 400);
    }

    req.body.name = req.user.fullname;
    req.body.email = req.user.email;
    req.body.createdBy = req.user._id;

    if (req.user.role.title == "HOP") {
      req.body.headOfProcurement = req.user._id;
    } else if (req.user.role.title == "Admin" || req.user.role.title == "Front Desk Officer") {
      req.body.frontDeskOfficer = req.user._id;
    } else {
      return new ErrorResponseJSON(res, "You are not authorized to create projects!", 404);
    }

    const projectInitiation = await ProjectInitiation.create(req.body);

    if (!projectInitiation) {
      return new ErrorResponseJSON(res, "ProjectInitiation not created!", 404);
    }

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
    const projectInitiation = await ProjectInitiation.findById(req.params.id);

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

// TODO: Add approve and decline endpoints

// @desc    Approve ProjectInitiation
// @route  GET /api/v1/projectInitiation/:id/approve
// @access   Private
exports.approveProjectInitiation = asyncHandler(async (req, res, next) => {
  try {
    const projectInitiation = await ProjectInitiation.findById(req.params.id);

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

// TODO: Add update status endpoints

// @desc    Decline ProjectInitiation
// @route  GET /api/v1/projectInitiation/:id/decline
// @access   Private
exports.declineProjectInitiation = asyncHandler(async (req, res, next) => {
  try {
    const projectInitiation = await ProjectInitiation.findById(req.params.id);

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

// TODO: Add project tasks endpoint

// @desc    Get ProjectInitiation Tasks
// @route  GET /api/v1/projectInitiation/:id/tasks
// @access   Private
exports.geteProjectInitiationTasks = asyncHandler(async (req, res, next) => {
  try {
    const projectInitiation = await ProjectInitiation.findById(req.params.id);

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
