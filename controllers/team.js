const asyncHandler = require("../middleware/async");
const Team = require("../models/Team");
const {ErrorResponseJSON} = require("../utils/errorResponse");


// @desc    Create Team
// @route  POST /api/v1/team
// @access   Private
exports.createTeam = asyncHandler(async (req, res, next) => {

  const Team = await Team.find({title: req.body.title})

  if (Team.length > 0) {
    return new ErrorResponseJSON(res, "This team already exists, update it instead!", 400)
  }

  const team = await Team.create(req.body)

  if (!team) {
    return new ErrorResponseJSON(res, "Team not created!", 404)
  }
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
