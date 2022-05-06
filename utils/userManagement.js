const asyncHandler = require("../middleware/async");
const Role = require("../models/Role");
const Staff = require("../models/Staff");


exports.configureHeadRoles = asyncHandler(async (team, req, res, next) => {
  /**
   * Configure Procurement Head (HOP) and Team Head Roles when roles are created or updated
   * */ 
  if (team.title == "Procurement" && team.head) {
    const procurementHead = await Staff.findById(team.head)
    const procurementHeadRole = await Role.findOne({title: "HOP"})
    procurementHead.isTeamHead = true
    procurementHead.isHOP = true
    procurementHead.role = procurementHeadRole
    await procurementHead.save()

  } else if (team.head) {
    const head = await Staff.findById(team.head)
    const headRole = await Role.findOne({title: "Team Head"})
    head.isTeamHead = true
    head.role = headRole
    await head.save()
  }

  return true
})