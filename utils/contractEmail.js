const asyncHandler = require("../middleware/async")
const ContractEvaluation = require("../models/ContractEvaluation")
const ProjectInitiation = require("../models/ProjectInitiation")
const ProjectOnboarding = require("../models/ProjectOnboarding")
const Staff = require("../models/Staff")
const sendEmail = require("./sendEmail")


exports.contractEvaluationEmail = asyncHandler(async (contractEvaluationInstance, req, res, next) => {
  /**
   * TODO: 
   * • PPC portal notifies Front Office/ Admin team member on screen that obligation has been saved successfully
   */
  // const contractEvaluation = await ProjectOnboarding.findById(contractEvaluationInstance._id).populate(
  //   // "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
  //   // assignedTo assignedBy createdBy updatedBy"
  // )
  const projectInitiation = await ProjectInitiation.findById(contractEvaluationInstance.project).populate(
    "contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy"
  )

  // const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)    
  const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
  // const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
  const evaluatingOfficer = await Staff.findById(contractEvaluationInstance.evaluatingOfficer)

  // For Front Desk Officer / Admin
  const Subject = `Project Contract Evaluation `
  const Salutation = `Hello,`
  const Message = `
    Proposition testing
  `
  const Options = {
    to: [frontDeskOfficer.email], // email
    // cc: [projectDeskOfficer.email, headOfProcurement.email], // cc
    subject: Subject, // subject
    text: Salutation, // message (salutation)
    html: Message, // html
  }

  // For Evaluating Officer
  const evaluatingOfficerSubject = `Project Contract Evaluation `
  const evaluatingOfficerSalutation = `Hello,`
  const evaluatingOfficerMessage = `
    Proposition testing
  `
  const evaluatingOfficerOptions = {
    to: [evaluatingOfficer.email], // email
    // cc: [evaluatingOfficer, projectDeskOfficer.email, headOfProcurement.email], // cc
    subject: evaluatingOfficerSubject, // subject
    text: evaluatingOfficerSalutation, // message (salutation)
    html: evaluatingOfficerMessage, // html
  }
  try {
    const email = await sendEmail(Options)
    const evaluatingOfficerEmail = await sendEmail(evaluatingOfficerOptions)
    console.log(`email: ${email}`)
    console.log(`evaluatingOfficerEmail: ${evaluatingOfficerEmail}`)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
  
})
