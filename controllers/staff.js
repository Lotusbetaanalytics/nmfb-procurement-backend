const asyncHandler = require("../middleware/async");
const Staff = require("../models/Staff");
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse");
const {giveRolesAndTeams} = require("../utils/userManagement")
const {addUserDetails, checkInstance} = require("../utils/queryUtils");


exports.populateStaff = "team role photo"


// @desc    Create Staff
// @route  POST /api/v1/staff
// @access   Private
exports.createStaff = asyncHandler(async (req, res, next) => {
    // const existingStaff = await Staff.find({email: req.body.email}).populate(this.populateStaff);

    // if (existingStaff.length > 0) {
    //   return new ErrorResponseJSON(res, "This staff already exists, update it instead!", 400);
    // }

    await this.checkStaff(req, res, {email: req.body.email})
    // Only email, role and team are accepted
    payload = {
      email: req.body.email,
      role: req.body.role,
      team: req.body.team,
    };

    const staff = await Staff.create(payload);
    if (!staff) {
      return new ErrorResponseJSON(res, "Staff not created!", 404);
    }
    // res.status(200).json({
    //   success: true,
    //   message: "Only email, role and team are accepted",
    //   data: staff,
    // });
    return new SuccessResponseJSON(res, staff, 201)
});


// @desc    Get all Staffs
// @route  GET /api/v1/staff
// @access   Public
exports.getAllStaffs = asyncHandler(async (req, res, next) => {
  // await giveRolesAndTeams()
  return res.status(200).json(res.advancedResults);
});


// @desc    Get Staff
// @route  GET /api/v1/staff/:id
// @access   Private
exports.getStaff = asyncHandler(async (req, res, next) => {
    // const staff = await Staff.findById(req.params.id).populate(this.populateStaff);
    // if (!staff) {
    //   return new ErrorResponseJSON(res, "Staff not found!", 404);
    // }
    const staff = await this.checkStaff(req, res)
    return new SuccessResponseJSON(res, staff)
});


// @desc    Update Staff
// @route  PATCH /api/v1/staff/:id
// @access   Private
exports.updateStaff = asyncHandler(async (req, res, next) => {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!staff) {
      return new ErrorResponseJSON(res, "Staff not updated!", 400);
    }
    return new SuccessResponseJSON(res, staff)
});


// @desc    Delete Staff
// @route  DELETE /api/v1/staff
// @access   Private
exports.deleteStaff = asyncHandler(async (req, res, next) => {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return new ErrorResponseJSON(res, "Staff not found!", 404);
    }
    return new SuccessResponseJSON(res, staff)
});


// @desc    Get all Staff in a team
// @route  GET /api/v1/staff/team/:id
// @access   Private
exports.getTeamStaff = asyncHandler(async (req, res, next) => {
    const staff = await Staff.find({team: req.params.id}).populate(this.populateStaff);

    // if (staff.length < 1) {
    //   return new ErrorResponseJSON(res, "Staff not found!", 404);
    // }
    return new SuccessResponseJSON(res, staff)
});


// @desc    Get all Staff with a role
// @route  GET /api/v1/staff/role/:id
// @access   Private
exports.getRoleStaff = asyncHandler(async (req, res, next) => {
    const staff = await Staff.find({role: req.params.id}).populate(this.populateStaff);
    // if (staff.length < 1) {
    //   return new ErrorResponseJSON(res, "Staff not found!", 404);
    // }
    return new SuccessResponseJSON(res, staff)
});


/**
 * TODO: Replace these endpoints with the advanced results endpoint
// @desc    Get all Team Head
// @route  GET /api/v1/staff/teamHead
// @access   Private
exports.getTeamHeads = asyncHandler(async (req, res, next) => {
    const staff = await Staff.find({isTeamHead: true}).populate(this.populateStaff);

    // if (staff.length < 1) {
    //   return new ErrorResponseJSON(res, "Staff not found!", 404);
    // }
    return new SuccessResponseJSON(res, staff)
});


// @desc    Get all Project Desk Officers (PDO)
// @route  GET /api/v1/staff/PDO
// @access   Private
exports.getPDOs = asyncHandler(async (req, res, next) => {
    const staff = await Staff.find({isPDO: true}).populate(this.populateStaff);

    // if (staff.length < 1) {
    //   return new ErrorResponseJSON(res, "Staff not found!", 404);
    // }
    return new SuccessResponseJSON(res, staff)
});


// @desc    Get all Admin (Front Desk Officers)
// @route  GET /api/v1/staff/frontDesk
// @access   Private
exports.getAdmins = asyncHandler(async (req, res, next) => {
    const staff = await Staff.find({isAdmin: true}).populate(this.populateStaff);

    // if (staff.length < 1) {
    //   return new ErrorResponseJSON(res, "Staff not found!", 404);
    // }
    return new SuccessResponseJSON(res, staff)
});


// @desc    Get Head of Procurement (HOP)
// @route  GET /api/v1/staff/headOfProcurement
// @access   Private
exports.getHOP = asyncHandler(async (req, res, next) => {
    const staff = await Staff.find({isHOP: true}).populate(this.populateStaff);

    // if (!staff) {
    //   return new ErrorResponseJSON(res, "Staff not found!", 404);
    // }
    return new SuccessResponseJSON(res, staff)
});
 */


exports.checkStaff = async (req, res, query = {}) => {
  /**
   * @summary
   *  check if Staff instance exists, check if req.params.id exists and perform logic based on that
   * 
   * @throws `Staff not Found!`, 404
   * @throws `This Staff already exists, update it instead!`, 400
   * 
   * @returns product initiation instance 
   */
  let staff = await checkInstance(
    req, res, Staff, this.populateStaff, query, "Staff"
  )
  return staff
}
