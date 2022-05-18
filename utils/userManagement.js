const asyncHandler = require("../middleware/async");
const Role = require("../models/Role");
const Staff = require("../models/Staff");


exports.giveRolesAndTeams = asyncHandler(async () => {
  const allStaff = await Staff.find()
  for (let [key, staff] of Object.entries(allStaff)) {
    try{
      staff =  await Staff.findById(staff._id)
      // if (!staff.role) staff.role = "627458f60f6ed166b88dd62b" //Admin
      if (!staff.role || staff.role == "627458f60f6ed166b88dd62b") staff.role = "6274ce252d0730f3b263f9cd" //Super Admin
      if (!staff.team) staff.team = "6283d98e48ee0a49d5ec135e"
      await staff.save()
      if (!staff.role || staff.role == "627458f60f6ed166b88dd62b" || !staff.team) console.log("role and team added")
      console.log(`role, team: ${staff.role}, ${staff.team}`)
    } catch(err) {
      console.log(err.message)
      return false
    }
  } 
  return true
})


exports.configureHeadRoles = asyncHandler(async (team, req, res, next) => {
  /**
   * Configure Procurement Head (HOP) and Team Head Roles when roles are created or updated
   * */ 
  try {
    if (team.title == "Procurement" && team.head) {
      const procurementHead = await Staff.findById(team.head)
      const procurementHeadRole = await Role.findOne({title: "Head of Procurement"})
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
  } catch (err) {
    console.log(err.message)
    return false
  }

})