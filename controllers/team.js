const asyncHandler = require("../middleware/async");
const Team = require("../models/Team");
const {ErrorResponseJSON} = require("../utils/errorResponse");
const {configureHeadRoles} = require("../utils/userManagement")


// @desc    Create Team
// @route  POST /api/v1/team
// @access   Private
exports.createTeam = asyncHandler(async (req, res, next) => {

  const existingTeam = await Team.find({title: req.body.title})

  if (existingTeam.length > 0) {
    return new ErrorResponseJSON(res, "This team already exists, update it instead!", 400)
  }

  const team = await Team.create(req.body)

  // if (team.title == "Procurement" && team.head) {
  //   const procurementHead = await Staff.findById(team.head)
  //   const procurementHeadRole = await Role.findOne({title: "HOP"})
  //   procurementHead.isTeamHead = true
  //   procurementHead.isHOP = true
  //   procurementHead.role = procurementHeadRole
  //   await procurementHead.save()
  // } else if (team.head) {
  //   const head = await Staff.findById(team.head)
  //   const headRole = await Role.findOne({title: "HOP"})
  //   head.isTeamHead = true
  //   head.role = headRole
  //   await head.save()
  // }

  if (!team) {
    return new ErrorResponseJSON(res, "Team not created!", 404)
  }

  await configureHeadRoles(team)

  res.status(200).json({
    success: true,
    data: team,
  })
})


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
  const team = await Team.findById(req.params.id);

  if (!team) {
    return new ErrorResponseJSON(res, "Team not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: team,
  });
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

  await configureHeadRoles(team)

  res.status(200).json({
    success: true,
    data: team,
  });
});


// @desc    Delete Team
// @route  DELETE /api/v1/team
// @access   Private
exports.deleteTeam = asyncHandler(async (req, res, next) => {
  const team = await Team.findByIdAndDelete(req.params.id);

  if (!team) {
    return new ErrorResponseJSON(res, "Team not found!", 404);
  }
  res.status(200).json({
    success: true,
    data: team,
  });
});
