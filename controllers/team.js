const asyncHandler = require("../middleware/async");
const Team = require("../models/Team");
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse");
const {configureHeadRoles} = require("../utils/userManagement");
const {addUserDetails, checkInstance} = require("../utils/queryUtils");


exports.populateTeam = "role head"


// @desc    Create Team
// @route  POST /api/v1/team
// @access   Private
exports.createTeam = asyncHandler(async (req, res, next) => {
  // check for existing team instance
  await this.checkTeam(req, res, {title: req.body.title})

  const team = await Team.create(req.body);
  if (!team) {
    return new ErrorResponseJSON(res, "Team not created!", 404);
  }

  await configureHeadRoles(team);

  return new SuccessResponseJSON(res, team)
});


// @desc    Get all Teams
// @route  GET /api/v1/team
// @access   Public
exports.getAllTeams = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});


// @desc    Get Team
// @route  GET /api/v1/team/:id
// @access   Private
exports.getTeam = asyncHandler(async (req, res, next) => {
  const team = await this.checkTeam(req, res)
  return new SuccessResponseJSON(res, team)
});


// @desc    Update Team
// @route  PATCH /api/v1/team/:id
// @access   Private
exports.updateTeam = asyncHandler(async (req, res, next) => {
  const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!team) {
    return new ErrorResponseJSON(res, "Team not updated!", 400);
  }

  await configureHeadRoles(team);

  return new SuccessResponseJSON(res, team)
});


// @desc    Delete Team
// @route  DELETE /api/v1/team
// @access   Private
exports.deleteTeam = asyncHandler(async (req, res, next) => {
  const team = await Team.findByIdAndDelete(req.params.id);
  if (!team) {
    return new ErrorResponseJSON(res, "Team not found!", 404);
  }
  return new SuccessResponseJSON(res, team)
});


exports.checkTeam = async (req, res, query = {}) => {
  /**
   * @summary
   *  check if Team instance exists, check if req.params.id exists and perform logic based on that
   * 
   * @throws `Team not Found!`, 404
   * @throws `This Team already exists, update it instead!`, 400
   * 
   * @returns Team instance
   */
  let team = await checkInstance(
    req, res, Team, this.populateTeam, query, "Team"
  )
  return team
}
