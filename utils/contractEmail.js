const asyncHandler = require("../middleware/async")
const ContractEvaluation = require("../models/ContractEvaluation")
const ProjectInitiation = require("../models/ProjectInitiation")
const ProjectOnboarding = require("../models/ProjectOnboarding")
const Staff = require("../models/Staff")
const {populateProjectInitiation} = require("../controllers/projectInitiation")
const {getStaffEmail} = require("./queryUtils")
const sendEmail = require("./sendEmail")


exports.contractEvaluationEmail = async (contractEvaluation, updated = false) => {
  /**
   * TODO: 
   * • PPC portal notifies Front Office/ Admin team member on screen that obligation has been saved successfully
   */

  const projectInitiation = await ProjectInitiation.findById(contractEvaluation.project).populate(populateProjectInitiation)

  const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)    
  const headOfProcurementEmail = getStaffEmail(headOfProcurement)
  const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
  const frontDeskOfficerEmail = getStaffEmail(frontDeskOfficer)
  const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
  const projectDeskOfficerEmail = getStaffEmail(projectDeskOfficer)
  const evaluatingOfficer = await Staff.findById(contractEvaluation.evaluatingOfficer)
  const evaluatingOfficerEmail = getStaffEmail(evaluatingOfficer)

  const reciepients = []
  if (frontDeskOfficerEmail) {reciepients.push(frontDeskOfficerEmail)}
  if (evaluatingOfficerEmail) {reciepients.push(evaluatingOfficerEmail)}
  const cc = []
  if (headOfProcurementEmail) {cc.push(headOfProcurementEmail)}
  if (projectDeskOfficerEmail) {cc.push(projectDeskOfficerEmail)}

  const emailSubject = `Project Contract Evaluation `
  const emailSalutation = `Hello,`
  const emailMessage = `
  Project Contract Evaluation Email
  `
  const emailOptions = {
    to: reciepients, // email
    cc: cc, // cc
    subject: emailSubject, // subject
    text: emailSalutation, // message (salutation)
    html: emailMessage, // html
  }

  if (updated) {
    emailOptions.subject = `Project Contract Evaluation Update`

    const updatedBy = await Staff.findById(contractEvaluation.updatedBy)
    emailOptions.cc.push(getStaffEmail(updatedBy))

    emailOptions.html = `Project Contract Evaluation Update Email`
  } else {
    const createdBy = await Staff.findById(contractEvaluation.createdBy)
    emailOptions.cc.push(getStaffEmail(createdBy))
  }

  try {
    const email = await sendEmail(emailOptions)
    console.log(`email: ${email}`)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}


// exports.contractEvaluationEmail = asyncHandler(async (contractEvaluationInstance, req, res, next) => {
//   /**
//    * TODO: 
//    * • PPC portal notifies Front Office/ Admin team member on screen that obligation has been saved successfully
//    */
//   // const contractEvaluation = await ProjectOnboarding.findById(contractEvaluationInstance._id).populate(
//   //   // "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
//   //   // assignedTo assignedBy createdBy updatedBy"
//   // )
//   const projectInitiation = await ProjectInitiation.findById(contractEvaluationInstance.project).populate(
//     "contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy"
//   )

//   // const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)    
//   const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
//   // const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
//   const evaluatingOfficer = await Staff.findById(contractEvaluationInstance.evaluatingOfficer)

//   // For Front Desk Officer / Admin
//   const Subject = `Project Contract Evaluation `
//   const Salutation = `Hello,`
//   const Message = `
//     Proposition testing
//   `
//   const Options = {
//     to: [frontDeskOfficer.email], // email
//     // cc: [projectDeskOfficer.email, headOfProcurement.email], // cc
//     subject: Subject, // subject
//     text: Salutation, // message (salutation)
//     html: Message, // html
//   }

//   // For Evaluating Officer
//   const evaluatingOfficerSubject = `Project Contract Evaluation `
//   const evaluatingOfficerSalutation = `Hello,`
//   const evaluatingOfficerMessage = `
//     Proposition testing
//   `
//   const evaluatingOfficerOptions = {
//     to: [evaluatingOfficer.email], // email
//     // cc: [evaluatingOfficer, projectDeskOfficer.email, headOfProcurement.email], // cc
//     subject: evaluatingOfficerSubject, // subject
//     text: evaluatingOfficerSalutation, // message (salutation)
//     html: evaluatingOfficerMessage, // html
//   }
//   try {
//     const email = await sendEmail(Options)
//     const evaluatingOfficerEmail = await sendEmail(evaluatingOfficerOptions)
//     console.log(`email: ${email}`)
//     console.log(`evaluatingOfficerEmail: ${evaluatingOfficerEmail}`)
//     return true
//   } catch (err) {
//     console.log(err)
//     return false
//   }
  
// })
