const asyncHandler = require("../middleware/async")
const ContractEvaluation = require("../models/ContractEvaluation")
const ProjectInitiation = require("../models/ProjectInitiation")
const ProjectOnboarding = require("../models/ProjectOnboarding")
const Staff = require("../models/Staff")
const {
  populateProjectInitiation,
  populateProjectOnboarding,
  populateProjectTask,
  populateStaff,
} = require("./projectUtils")
const {
  populateContract,
  populateContractEvaluation,
} = require("./contractUtils")
const sendEmail = require("./sendEmail")
const {getStaffEmail} = require("./queryUtils")


exports.projectInitiationEmail = async (projectInitiation, updated = false) => {
  // Send mail to the HOP, PDO and Front desk officer when project is initiated and when initiation is updated
  const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)
  const headOfProcurementEmail = getStaffEmail(headOfProcurement)
  const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
  const projectDeskOfficerEmail = getStaffEmail(projectDeskOfficer)
  const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
  const frontDeskOfficerEmail = getStaffEmail(frontDeskOfficer)

  const reciepients = []
  if (headOfProcurement) {reciepients.push(headOfProcurementEmail)}
  const cc = []
  if (projectDeskOfficerEmail) {cc.push(projectDeskOfficerEmail)}
  if (frontDeskOfficerEmail) {cc.push(frontDeskOfficerEmail)}
  const emailSubject = `Project Initiation`
  const emailSalutation = `Hello,`
  let emailMessage = `
  Project Initiation Started by Head of Procurement
  `
  if (projectInitiation.createdBy == projectInitiation.frontDeskOfficer) {
    emailMessage = `
    Project Initiation Started by Front Desk
    `
  }
  const emailOptions = {
    to: reciepients, // email
    cc: cc, // cc
    subject: emailSubject, // subject
    text: emailSalutation, // message (salutation)
    html: emailMessage, // html
  }

  if (updated) {
    emailOptions.subject = `Project Initiation Update`

    const updatedBy = await Staff.findById(projectInitiation.updatedBy)
    emailOptions.cc.push(getStaffEmail(updatedBy))

    emailOptions.html = `Project Initiation Update Email`
  } else {
    const createdBy = await Staff.findById(projectInitiation.createdBy)
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


exports.projectOnboardingEmail = async (projectOnboarding, updated = false) => {
  /** 
   * • If the selected contract type is ‘existing contract’ the system shall send an email notification to the PDO to specify evaluation officers and save the project to the ‘renewal list’ 
   * • If the selected contract type is ‘new’ the system shall send an email notification to the PDO with a link to scope the project and save the project to the ‘New project list’
   */
  projectOnboarding = await projectOnboarding.populate(populateProjectOnboarding)

  const projectInitiation = await ProjectInitiation.findById(projectOnboarding.project).populate(populateProjectInitiation)

  const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)
  const headOfProcurementEmail = getStaffEmail(headOfProcurement)
  const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
  const frontDeskOfficerEmail = getStaffEmail(frontDeskOfficer)
  const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
  const projectDeskOfficerEmail = getStaffEmail(projectDeskOfficer)

  const contractTypeTitle = projectOnboarding.contractType.title

  const reciepients = []
  if (projectDeskOfficerEmail) {reciepients.push(projectDeskOfficerEmail)}
  const cc = []
  if (headOfProcurementEmail) {cc.push(headOfProcurementEmail)}
  if (frontDeskOfficerEmail) {cc.push(frontDeskOfficerEmail)}
  const emailSubject = `Project Onboarding with ${contractTypeTitle} and Scope`
  const emailSalutation = `Hello,`
  // Default message is for New Contract
  const emailMessage = `
    Project Onboarding Email for New Contract
  `
  const emailOptions = {
    to: [projectDeskOfficerEmail], // email
    cc: [frontDeskOfficerEmail, headOfProcurementEmail], // cc
    subject: emailSubject, // subject
    text: emailSalutation, // message (salutation)
    html: emailMessage, // html
  }

  if (contractTypeTitle == "Existing Contract") {
    emailOptions.html = `
    Project Onboarding Email for Existing Contract`
  }

  if (updated) {
    emailOptions.subject = `Project Onboarding Update`

    const updatedBy = await Staff.findById(projectOnboarding.updatedBy)
    emailOptions.cc.push(getStaffEmail(updatedBy))

    emailOptions.html = `Project Onboarding Update Email`
  } else {
    const createdBy = await Staff.findById(projectOnboarding.createdBy)
    emailOptions.cc.push(getStaffEmail(createdBy))
  }

  try {
    const email = await sendEmail(emailOptions)
    console.log(`email: ${email}`)
    // return true
  } catch (err) {
    console.log(err)
    // return false
  }
}


// exports.projectInitiationEmailDepreciated = asyncHandler(async (projectInitiation, req, res, next) => {
//   if (projectInitiation.createdBy == projectInitiation.headOfProcurement) {
//     // TODO: Send mail to the HOP, PDO and Front desk officer
//     // For HOP
//     const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)
//     const headOfProcurementSubject = `Project Initiation`
//     const headOfProcurementSalutation = `Hello,`
//     const headOfProcurementMessage = `
//       Proposition testing
//     `
//     const headOfProcurementOptions = {
//       to: [headOfProcurement.email], // email
//       // cc: [frontDeskOfficer.email, projectDeskOfficer.email], // cc
//       subject: headOfProcurementSubject, // subject
//       text: headOfProcurementSalutation, // message (salutation)
//       html: headOfProcurementMessage, // html
//     }
    
//     // For PDO and Front Desk Officer / Admin
//     const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
//     const projectDeskOfficerEmail = projectDeskOfficer ? projectDeskOfficer.email : undefined
//     const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
//     const frontDeskOfficerEmail = frontDeskOfficer ? frontDeskOfficer.email : undefined
//     const frontDeskOfficerSubject = `Project Initiation`
//     const frontDeskOfficerSalutation = `Hello,`
//     const frontDeskOfficerMessage = `
//       Proposition testing
//     `
//     if (projectDeskOfficerEmail || frontDeskOfficerEmail) {
//       const frontDeskOfficerOptions = {
//         to: [frontDeskOfficer.email, projectDeskOfficer.email], // email
//         // cc: [headOfProcurement.email], // cc
//         subject: frontDeskOfficerSubject, // subject
//         text: frontDeskOfficerSalutation, // message (salutation)
//         html: frontDeskOfficerMessage, // html
//       }
//       try {
//         const emailHOP = await sendEmail(headOfProcurementOptions)
//         const emailFDO = await sendEmail(frontDeskOfficerOptions)
//         console.log(`emailHOP: ${emailHOP}`)
//         console.log(`emailFDO: ${emailFDO}`)
//         return true
//       } catch (err) {
//         console.log(err)
//         return false
//       }
//     }

//   } else if (projectInitiation.createdBy == projectInitiation.frontDeskOfficer) {
//     // TODO: Send different mail to the HOP, PDO and Front desk officer
//     // For HOP
//     const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)
//     const headOfProcurementSubject = `Project Initiation`
//     const headOfProcurementSalutation = `Hello,`
//     const headOfProcurementMessage = `
//       Proposition testing
//     `
//     const headOfProcurementOptions = {
//       to: [headOfProcurement.email], // email
//       // cc: [frontDeskOfficer.email, projectDeskOfficer.email], // cc
//       subject: headOfProcurementSubject, // subject
//       text: headOfProcurementSalutation, // message (salutation)
//       html: headOfProcurementMessage, // html
//     }
    
//     // For PDO and Front Desk Officer / Admin
//     const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
//     const projectDeskOfficerEmail = projectDeskOfficer ? projectDeskOfficer.email : undefined
//     const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
//     const frontDeskOfficerEmail = frontDeskOfficer ? frontDeskOfficer.email : undefined
//     const frontDeskOfficerSubject = `Project Initiation`
//     const frontDeskOfficerSalutation = `Hello,`
//     const frontDeskOfficerMessage = `
//       Proposition testing
//     `
//     if (projectDeskOfficerEmail || frontDeskOfficerEmail) {
//       const frontDeskOfficerOptions = {
//         to: [frontDeskOfficer.email, projectDeskOfficer.email], // email
//         // cc: [headOfProcurement.email], // cc
//         subject: frontDeskOfficerSubject, // subject
//         text: frontDeskOfficerSalutation, // message (salutation)
//         html: frontDeskOfficerMessage, // html
//       }
//       try {
//         const emailHOP = await sendEmail(headOfProcurementOptions)
//         const emailFDO = await sendEmail(frontDeskOfficerOptions)
//         console.log(`emailHOP: ${emailHOP}`)
//         console.log(`emailFDO: ${emailFDO}`)
//         return true
//       } catch (err) {
//         console.log(err)
//         return false
//       }
//     }

//   } else {
//     console.log(`Project Initiated Improperly`)
//     // Do stuff to the project initiation
//     return false
//   }
// })


// exports.projectInitiationUpdateEmailDepreciated = asyncHandler(async (projectInitiation, req, res, next) => {
//   const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)
//   const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
//   const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
//   const updatedBy = await Staff.findById(projectInitiation.updatedBy)

//   const subject = `Project Initiation Update`
//   const salutation = `Hello,`
//   const message = `
//     Proposition testing
//   `
//   const options = {
//     to: [headOfProcurement.email, frontDeskOfficer.email, projectDeskOfficer.email], // email
//     cc: [updatedBy.email], // cc
//     subject: subject, // subject
//     text: salutation, // message (salutation)
//     html: message, // html
//   }
//   try {
//     const email = await sendEmail(options)
//     console.log(`email: ${email}`)
//     return true
//   } catch (err) {
//     console.log(err)
//     return false
//   }
// })




// exports.projectOnboardingEmailDepreciated = asyncHandler(async (projectOnboardingInstance, req, res, next) => {
//   /**
//    * TODO: 
//    * • If the selected contract type is ‘existing contract’ the system shall send an email notification to the PDO to specify evaluation officers and save the project to the ‘renewal list’ 
//    * • If the selected contract type is ‘new’ the system shall send an email notification to the PDO with a link to scope the project and save the project to the ‘New project list’
//    */
//   const projectOnboarding = await ProjectOnboarding.findById(projectOnboardingInstance._id).populate(populateProjectOnboarding)
//   const projectInitiation = await ProjectInitiation.findById(projectOnboardingInstance.project).populate(populateProjectInitiation)

//   // const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)    
//   // const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
//   const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
  
//   if (projectOnboarding.contractType.title == "Existing Contract") {
//     // TODO: Send mail to the HOP, PDO and Front desk officer
//     // For HOP, PDO and Front Desk Officer / Admin
    
//     const Subject = `Project Onboarding and Contract Evaluation `
//     const Salutation = `Hello,`
//     const Message = `
//       Proposition testing
//     `
//     const Options = {
//       to: [projectDeskOfficer.email], // email
//       // cc: [frontDeskOfficer.email, headOfProcurement.email], // cc
//       subject: Subject, // subject
//       text: Salutation, // message (salutation)
//       html: Message, // html
//     }
//     try {
//       const email = await sendEmail(Options)
//       console.log(`email: ${email}`)
//       return true
//     } catch (err) {
//       console.log(err)
//       return false
//     }

//   } else if (projectOnboarding.contractType.title == "New Contract") {
//     // TODO: Send mail to the HOP, PDO and Front desk officer
//     // For HOP, PDO and Front Desk Officer / Admin
    
//     const Subject = `Project Onboarding with New Contract and Scope`
//     const Salutation = `Hello,`
//     const Message = `
//       Proposition testing
//     `
//     const Options = {
//       to: [projectDeskOfficer.email], // email
//       // cc: [frontDeskOfficer.email, headOfProcurement.email], // cc
//       subject: Subject, // subject
//       text: Salutation, // message (salutation)
//       html: Message, // html
//     }
//     try {
//       const email = await sendEmail(Options)
//       console.log(`email: ${email}`)
//       return true
//     } catch (err) {
//       console.log(err)
//       return false
//     }

//   } else {
//     console.log(`Project Onboarded Improperly`)
//     // Do stuff to the project initiation
//     return false
//   }
// })


// exports.projectOnboardingUpdateEmailDepreciated = asyncHandler(async (projectOnboardingInstance, req, res, next) => {
//   const projectInitiation = await ProjectInitiation.findById(projectOnboardingInstance.project).populate(populateProjectInitiation)
//   const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)
//   const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
//   const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
//   const updatedBy = await Staff.findById(projectOnboardingInstance.updatedBy)

//   const subject = `Project Onboarding Update`
//   const salutation = `Hello,`
//   const message = `
//     Proposition testing
//   `
//   const options = {
//     to: [headOfProcurement.email, frontDeskOfficer.email, projectDeskOfficer.email], // email
//     cc: [updatedBy.email], // cc
//     subject: subject, // subject
//     text: salutation, // message (salutation)
//     html: message, // html
//   }
//   try {
//     const email = await sendEmail(options)
//     console.log(`email: ${email}`)
//     return true
//   } catch (err) {
//     console.log(err)
//     return false
//   }
// })


exports.projectAssignmentEmail = async (projectInitiation, updated = false) => {
  /**
   * @summary
   *  PPC portal forwards project to the responsible officer and send email notification to the responsible officer and head of procurement.
   */

  const reciepients = []
  let subject = `Project Assigned `
  let salutation = `Hello,`
  let message = `
    Project Assignment Email
  `
  if (updated) {
    const updatedBy = await Staff.findById(projectInitiation.updatedBy)
    if (updatedBy) reciepients.push(getStaffEmail(updatedBy))
    
    subject = `${subject} : Update`
    message = `Project Assignment Update Email`
  } else {
    const createdBy = await Staff.findById(projectInitiation.createdBy)
    if (createdBy) reciepients.push(getStaffEmail(createdBy))
  }
  const email = await this.projectStageEmail(projectInitiation, subject, salutation, message, reciepients, [], ["h", "f", "r"])
  return email
}


exports.projectTaskAssignmentEmail = async (projectTask, updated = false) => {
  /**
   * @summary 
   *  PPC portal saves status in pending list, forwards request to the responsible officer and send email notification to the responsible officer and the head of team
   */

  const projectInitiation = await ProjectInitiation.findById(projectTask.project).populate(populateProjectInitiation)

  const responsibleOfficer = await Staff.findById(projectTask.responsibleOfficer)
  const assignedBy = await Staff.findById(projectTask.assignedBy)
  const assignedTo = await Staff.findById(projectTask.assignedTo)

  const reciepients = []
  if (assignedBy) reciepients.push(getStaffEmail(assignedBy))
  if (assignedTo) reciepients.push(getStaffEmail(assignedTo))
  if (responsibleOfficer) reciepients.push(getStaffEmail(responsibleOfficer))

  let subject = `Project Task Assigned `
  let salutation = `Hello,`
  let message = `
    Project Task Assignment Email
  `
  if (updated) {
    const updatedBy = await Staff.findById(projectTask.updatedBy)
    if (updatedBy) reciepients.push(getStaffEmail(updatedBy))
    
    subject = `${subject} : Update`
    message = `Project Task Assignment Update Email`
  } else {
    const createdBy = await Staff.findById(projectTask.createdBy)
    if (createdBy) reciepients.push(getStaffEmail(createdBy))
  }
  const email = await this.projectStageEmail(projectInitiation, subject, salutation, message, reciepients, [], ["h", "f", "r"])
  return email
}


exports.projectTaskReassignmentEmail = async (projectTask, updated = false) => {
  /**
   * @summary 
   *  PPC portal saves status in pending list, forwards request to the responsible officer and send email notification to the responsible officer and the head of team
   */

  const projectInitiation = await ProjectInitiation.findById(projectTask.project).populate(populateProjectInitiation)

  const assignedBy = await Staff.findById(projectTask.assignedBy)
  const assignedTo = await Staff.findById(projectTask.assignedTo)
  const reassignedTo = await Staff.findById(projectTask.reassignedTo)
  const responsibleOfficer = await Staff.findById(projectTask.responsibleOfficer)

  const reciepients = []
  if (assignedBy) reciepients.push(getStaffEmail(assignedBy))
  if (assignedTo) reciepients.push(getStaffEmail(assignedTo))
  if (reassignedTo) reciepients.push(getStaffEmail(reassignedTo))
  if (responsibleOfficer) reciepients.push(getStaffEmail(responsibleOfficer))

  let subject = `Project Task ReAssigned `
  let salutation = `Hello,`
  let message = `
    Project Task ReAssignment Update Email
  `
  if (updated) {
    const updatedBy = await Staff.findById(projectTask.updatedBy)
    if (updatedBy) reciepients.push(getStaffEmail(updatedBy))
    
    subject = `${subject} : Update`
    message = `Project Task ReAssignment Update Email`
  } else {
    const createdBy = await Staff.findById(projectTask.createdBy)
    if (createdBy) reciepients.push(getStaffEmail(createdBy))
  }
  const email = await this.projectStageEmail(projectInitiation, subject, salutation, message, reciepients, [], ["h", "f", "r"])
  return email
}



// exports.projectAssignmentEmailDepreciated = asyncHandler(async (projectInitiationInstance, req, res, next) => {
//   /**
//    * Summary: Send Email to the responsible officer when the head of procurement assigns a project
//    * TODO: 
//    * • PPC portal forwards project to the responsible officer and send email notification to the responsible officer and head of procurement.
//    */
//   const projectInitiation = await ProjectInitiation.findById(projectInitiationInstance._id).populate(
//     "contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement responsibleOfficer createdBy updatedBy"
//   ) // const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)

//   const subject = `Project Assigned `
//   const salutation = `Hello,`
//   const message = `
//     Proposition testing
//   `
//   const options = {
//     to: [projectInitiation.responsibleOfficer.email], // email
//     cc: [projectInitiation.headOfProcurement.email], // cc
//     subject: subject, // subject
//     text: salutation, // (salutation)
//     html: message, // html
//   }
//   try {
//     const email = await sendEmail(options)
//     console.log(`email: ${email}`)
//     return true
//   } catch (err) {
//     console.log(err)
//     return false
//   }
// })


// exports.projectTaskAssignmentEmailDepreciated = asyncHandler(async (projectTaskInstance, req, res, next) => {
//   /**
//    * TODO: 
//    * • PPC portal saves status in pending list, forwards request to the responsible officer and send email notification to the responsible officer and the head of team
//    */
//   // const contractEvaluation = await ProjectOnboarding.findById(contractEvaluationInstance._id).populate(
//   //   // "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
//   //   // assignedTo assignedBy createdBy updatedBy"
//   // )
//   const projectInitiation = await ProjectInitiation.findById(projectTaskInstance.project).populate(populateProjectInitiation)

//   // const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)    
//   // const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
//   // const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
//   const responsibleOfficer = await Staff.findById(projectTaskInstance.responsibleOfficer)
//   const assignedBy = await Staff.findById(projectTaskInstance.assignedBy)
//   const assignedTo = await Staff.findById(projectTaskInstance.assignedTo)

//   // For Assigned To Staff
//   const subject = `Project Task Assigned `
//   const salutation = `Hello,`
//   const message = `
//     Proposition testing
//   `
//   const options = {
//     to: [assignedTo.email], // email
//     // cc: [projectDeskOfficer.email, headOfProcurement.email], // cc
//     subject: subject, // subject
//     text: salutation, // message (salutation)
//     html: message, // html
//   }

//   // For Responsible Officer and Assigned By Staff
//   const responsibleOfficerSubject = `Project Task Assigned `
//   const responsibleOfficerSalutation = `Hello,`
//   const responsibleOfficerMessage = `
//     Proposition testing
//   `
//   const responsibleOfficerOptions = {
//     to: [responsibleOfficer.email], // email
//     cc: [assignedBy.email], // cc
//     subject: responsibleOfficerSubject, // subject
//     text: responsibleOfficerSalutation, // message (salutation)
//     html: responsibleOfficerMessage, // html
//   }
//   try {
//     const email = await sendEmail(options)
//     const responsibleOfficerEmail = await sendEmail(responsibleOfficerOptions)
//     console.log(`email: ${email}`)
//     console.log(`responsibleOfficerEmail: ${responsibleOfficerEmail}`)
//     return true
//   } catch (err) {
//     console.log(err)
//     return false
//   }
  
// })


// exports.projectTaskReassignmentEmailDepreciated = asyncHandler(async (projectTaskInstance, req, res, next) => {
//   /**
//    * TODO: 
//    * • PPC portal saves status in pending list, forwards request to the responsible officer and send email notification to the responsible officer and the head of team
//    */
//   // const contractEvaluation = await ProjectOnboarding.findById(contractEvaluationInstance._id).populate(
//   //   // "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
//   //   // assignedTo assignedBy createdBy updatedBy"
//   // )
//   const projectInitiation = await ProjectInitiation.findById(projectTaskInstance.project).populate(populateProjectInitiation)

//   // const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)    
//   // const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
//   // const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
//   const responsibleOfficer = await Staff.findById(projectTaskInstance.responsibleOfficer)
//   const assignedBy = await Staff.findById(projectTaskInstance.assignedBy)
//   const assignedTo = await Staff.findById(projectTaskInstance.assignedTo)
//   const reassignedTo = await Staff.findById(projectTaskInstance.reassignedTo)

//   // For Assigned To Staff
//   const subject = `Project Task ReAssigned `
//   const salutation = `Hello,`
//   const message = `
//     Proposition testing
//   `
//   const options = {
//     to: [reassignedTo.email], // email
//     cc: [assignedTo.email, assignedBy.email], // cc
//     subject: subject, // subject
//     text: salutation, // message (salutation)
//     html: message, // html
//   }

//   // For Responsible Officer and Assigned By Staff
//   const responsibleOfficerSubject = `Project Task ReAssigned `
//   const responsibleOfficerSalutation = `Hello,`
//   const responsibleOfficerMessage = `
//     Proposition testing
//   `
//   const responsibleOfficerOptions = {
//     to: [responsibleOfficer.email], // email
//     cc: [assignedBy.email], // cc
//     subject: responsibleOfficerSubject, // subject
//     text: responsibleOfficerSalutation, // message (salutation)
//     html: responsibleOfficerMessage, // html
//   }
//   try {
//     const email = await sendEmail(options)
//     const responsibleOfficerEmail = await sendEmail(responsibleOfficerOptions)
//     console.log(`email: ${email}`)
//     console.log(`responsibleOfficerEmail: ${responsibleOfficerEmail}`)
//     return true
//   } catch (err) {
//     console.log(err)
//     return false
//   }
  
// })


/**
 * Project Stages for Document Upload
 * let stageNames = {
    "SCOPE/TOR/TECHNICAL SPECIFICATION": [],
    "COST ESTIMATION": [],
    "SELECTION METHOD": [],
    "NO OBJECTION": [],
    "ISSUANCE OF SPN": [],
    "SUBMISSION OF PROPOSALS": [],
    "BID OPENING EXERCISE": [],
    "EVALUATION OF BID OPENING EXERCISE": [],
    "CONTRACT RENEWAL / TERMINATION": [],
  }
 */


exports.projectTechnicalSpecificationEmail = async (projectInitiation, updated = false) => {
  /**
   * @summary 
   *  PPC portal forwards project to the responsible officer and send email notification to the responsible officer and head of procurement.
   */

  const subject = `Project Technical Specifications / Scope `
  const salutation = `Hello,`
  const message = `
    Proposition testing
  `
  const email = await this.projectStageEmail(projectInitiation, subject, salutation, message, [], [], ["h", "r"])
  return email
}


exports.projectCostEstimationEmail = async (projectInitiation, updated = false) => {
  /**
   * @summary 
   *  PPC portal sends email notification notifying the PDO to take action on the ‘selection method ‘ stage
   */

  const subject = `Selection Method Stage`
  const salutation = `Hello,`
  const message = `
    Kindly take action on the ‘selection method‘ stage.
  `
  const email = await this.projectStageEmail(projectInitiation, subject, salutation, message, [], [], ["h", "f"])
  return email
}


exports.projectSelectionMethodEmail = async (projectInitiation, updated = false) => {
  /**
   * @summary 
   *  PPC portal sends email notification notifying the PDO to take action on the ‘no objection ‘ stage
   */

  const subject = `No Objection Stage`
  const salutation = `Hello,`
  const message = `
    Kindly take action on the ‘no objection‘ stage.
  `
  const email = await this.projectStageEmail(projectInitiation, subject, salutation, message, [], [], ["h", "f"])
  return email
}


exports.projectNoObjectionEmail = async (projectInitiation, updated = false) => {
  /**
   * @summary 
   *  PPC portal sends email notification notifying the PDO to take action on the ‘issuance of SPN ‘ stage
   */

  const subject = `Issuance of SPN Stage`
  const salutation = `Hello,`
  const message = `
    Kindly take action on the ‘issuance of SPN‘ stage and SPN Deadline date.
  `
  const email = await this.projectStageEmail(projectInitiation, subject, salutation, message, [], [], ["h", "f"])
  return email
}


exports.projectIssuanceOfSPNEmail = async (projectInitiation, updated = false) => {
  /**
   * @summary 
   *  PPC portal sends email notification notifying the front desk to take action on the ‘Submission of Proposals ‘stage
   */
   
  const subject = `Submission of Proposals Stage`
  const salutation = `Hello,`
  const message = `
    Kindly take action on the ‘Submission of Proposals‘ stage.
  `
  const email = await this.projectStageEmail(projectInitiation, subject, salutation, message, [], [], ["h", "f"])
  return email
}


exports.projectSubmissionOfProposalsEmail = async (projectInitiation, updated = false) => {
  /**
   * @summary 
   *  PPC portal sends email notification notifying the HOP to take action on the ‘Evaluation ‘stage
   */

  const subject = `Evaluation Stage`
  const salutation = `Hello,`
  const message = `
    Kindly take action on the ‘Evaluation‘ stage.
  `
  const email = await this.projectStageEmail(projectInitiation, subject, salutation, message, [], [], ["h", "f"])
  return email
}


exports.projectBidOpeningExerciseEmail = async (projectInitiation, updated = false) => {
  /**
   * @summary 
   *  PPC portal sends email notification notifying the HOP to take action on the ‘Evaluation ‘stage
   */

  const contractEvaluation = await ContractEvaluation.find({project: projectInitiation._id}).populate(populateContractEvaluation)
  const evaluatingOfficer = await Staff.findById(contractEvaluation.evaluatingOfficer).populate(populateStaff)

  const cc = []
  // Add evaluating officer to the mail cc
  if (evaluatingOfficer) cc.push(getStaffEmail(evaluatingOfficer))

  const subject = `Evaluation of Bids Stage`
  const salutation = `Hello,`
  const message = `
    Kindly take action on the ‘Evaluation of Bids‘ stage.
  `
  const email = await this.projectStageEmail(projectInitiation, subject, salutation, message, [], cc, ["h"])
  return email
}


exports.projectBidEvaluationEmail = async (contractEvaluation, updated = false) => {
  /**
   * @summary 
   *  PPC portal sends email notification notifying the evaluation team member to take action on the ‘Prepare contract award ‘stage
   */

  const evaluatingOfficer = await Staff.findById(contractEvaluation.evaluatingOfficer).populate(populateStaff)
  const projectInitiation = await ProjectInitiation.findById(contractEvaluation.project).populate(populateProjectInitiation)

  const reciepients = []
  if (evaluatingOfficer) reciepients.push(getStaffEmail(evaluatingOfficer))

  let salutation = `Hello,`
  let subject = `Prepare Contract Termination Stage`
  let message = `Kindly take action on the ‘Prepare Contract Termination‘ stage.`

  if (contractEvaluation.score > 70) {
    subject = `Prepare Contract Award Stage`
    message = `Kindly take action on the ‘Prepare Contract Award‘ stage.`
  }
  const email = await this.projectStageEmail(projectInitiation, subject, salutation, message, reciepients, [], [])
  return email
}



// exports.projectTechnicalSpecificationEmailDepreciated = asyncHandler(async (projectInitiationInstance, req, res, next) => {
//   /**
//    * TODO: 
//    * • PPC portal forwards project to the responsible officer and send email notification to the responsible officer and head of procurement.
//    */
//   // const contractEvaluation = await ProjectOnboarding.findById(contractEvaluationInstance._id).populate(
//   //   // "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
//   //   // assignedTo assignedBy createdBy updatedBy"
//   // )
//   const projectInitiation = await ProjectInitiation.findById(projectInitiationInstance.id).populate(populateProjectInitiation)

//   const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)    
//   // const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
//   // const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
//   const responsibleOfficer = await Staff.findById(projectInitiation.responsibleOfficer)
//   // const assignedBy = await Staff.findById(projectInitiation.assignedBy)
//   // // const assignedTo = await Staff.findById(projectInitiation.assignedTo)

//   // // For Assigned To Staff
//   // const Subject = `Project Task Assigned `
//   // const Salutation = `Hello,`
//   // const Message = `
//   //   Proposition testing
//   // `
//   // const Options = {
//   //   // to: [assignedTo.email], // email
//   //   // cc: [projectDeskOfficer.email, headOfProcurement.email], // cc
//   //   subject: Subject, // subject
//   //   text: Salutation, // message (salutation)
//   //   html: Message, // html
//   // }

//   // For Responsible Officer
//   const responsibleOfficerSubject = `Project Technical Specifications / Scope `
//   const responsibleOfficerSalutation = `Hello,`
//   const responsibleOfficerMessage = `
//     Proposition testing
//   `
//   const responsibleOfficerOptions = {
//     to: [responsibleOfficer.email], // email
//     cc: [headOfProcurement.email], // cc
//     subject: responsibleOfficerSubject, // subject
//     text: responsibleOfficerSalutation, // message (salutation)
//     html: responsibleOfficerMessage, // html
//   }
//   try {
//     // const email = await sendEmail(Options)
//     const responsibleOfficerEmail = await sendEmail(responsibleOfficerOptions)
//     // console.log(`email: ${email}`)
//     console.log(`responsibleOfficerEmail: ${responsibleOfficerEmail}`)
//     return true
//   } catch (err) {
//     console.log(err)
//     return false
//   }
  
// })


// /**
//  * Project Stages for Document Upload
//  * let stageNames = {
//     "SCOPE/TOR/TECHNICAL SPECIFICATION": [],
//     "COST ESTIMATION": [],
//     "SELECTION METHOD": [],
//     "NO OBJECTION": [],
//     "ISSUANCE OF SPN": [],
//     "SUBMISSION OF PROPOSALS": [],
//     "BID OPENING EXERCISE": [],
//     "EVALUATION OF BID OPENING EXERCISE": [],
//     "CONTRACT RENEWAL / TERMINATION": [],
//   }
//  */


// exports.projectCostEstimationEmailDepreciated = asyncHandler(async (projectInitiationInstance, req, res, next) => {
//   /**
//    * TODO: 
//    * • PPC portal sends email notification notifying the PDO to take action on the ‘selection method ‘ stage
//    */
//   // const contractEvaluation = await ProjectOnboarding.findById(contractEvaluationInstance._id).populate(
//   //   // "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
//   //   // assignedTo assignedBy createdBy updatedBy"
//   // )
//   const projectInitiation = await ProjectInitiation.findById(projectInitiationInstance.id).populate(populateProjectInitiation)

//   // const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)    
//   // const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
//   const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
//   // const responsibleOfficer = await Staff.findById(projectInitiation.responsibleOfficer)
//   // const assignedBy = await Staff.findById(projectInitiation.assignedBy)
//   // // const assignedTo = await Staff.findById(projectInitiation.assignedTo)

//   // // For Assigned To Staff
//   // const Subject = `Project Task Assigned `
//   // const Salutation = `Hello,`
//   // const Message = `
//   //   Proposition testing
//   // `
//   // const Options = {
//   //   // to: [assignedTo.email], // email
//   //   // cc: [projectDeskOfficer.email, headOfProcurement.email], // cc
//   //   subject: Subject, // subject
//   //   text: Salutation, // message (salutation)
//   //   html: Message, // html
//   // }

//   // For Project Desk Officer
//   const projectDeskOfficerSubject = `Selection Method Stage`
//   const projectDeskOfficerSalutation = `Hello,`
//   const projectDeskOfficerMessage = `
//     Kindly take action on the ‘selection method‘ stage.
//   `
//   const projectDeskOfficerOptions = {
//     to: [projectDeskOfficer.email], // email
//     // cc: [headOfProcurement.email], // cc
//     subject: projectDeskOfficerSubject, // subject
//     text: projectDeskOfficerSalutation, // message (salutation)
//     html: projectDeskOfficerMessage, // html
//   }
//   try {
//     // const email = await sendEmail(Options)
//     const projectDeskOfficerEmail = await sendEmail(projectDeskOfficerOptions)
//     // console.log(`email: ${email}`)
//     console.log(`projectDeskOfficerEmail: ${projectDeskOfficerEmail}`)
//     return true
//   } catch (err) {
//     console.log(err)
//     return false
//   }
  
// })


// // TODO: Use projectCostEstimationEmail as a template for all document upload emails 

// exports.projectSelectionMethodEmailDepreciated = asyncHandler(async (projectInitiationInstance, req, res, next) => {
//   /**
//    * TODO: 
//    * • PPC portal sends email notification notifying the PDO to take action on the ‘no objection ‘ stage
//    */
//   // const contractEvaluation = await ProjectOnboarding.findById(contractEvaluationInstance._id).populate(
//   //   // "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
//   //   // assignedTo assignedBy createdBy updatedBy"
//   // )
//   const projectInitiation = await ProjectInitiation.findById(projectInitiationInstance.id).populate(populateProjectInitiation)

//   // const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)    
//   // const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
//   const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
//   // const responsibleOfficer = await Staff.findById(projectInitiation.responsibleOfficer)
//   // const assignedBy = await Staff.findById(projectInitiation.assignedBy)
//   // // const assignedTo = await Staff.findById(projectInitiation.assignedTo)

//   // // For Assigned To Staff
//   // const Subject = `Project Task Assigned `
//   // const Salutation = `Hello,`
//   // const Message = `
//   //   Proposition testing
//   // `
//   // const Options = {
//   //   // to: [assignedTo.email], // email
//   //   // cc: [projectDeskOfficer.email, headOfProcurement.email], // cc
//   //   subject: Subject, // subject
//   //   text: Salutation, // message (salutation)
//   //   html: Message, // html
//   // }

//   // For Project Desk Officer
//   const projectDeskOfficerSubject = `No Objection Stage`
//   const projectDeskOfficerSalutation = `Hello,`
//   const projectDeskOfficerMessage = `
//     Kindly take action on the ‘no objection‘ stage.
//   `
//   const projectDeskOfficerOptions = {
//     to: [projectDeskOfficer.email], // email
//     // cc: [headOfProcurement.email], // cc
//     subject: projectDeskOfficerSubject, // subject
//     text: projectDeskOfficerSalutation, // message (salutation)
//     html: projectDeskOfficerMessage, // html
//   }
//   try {
//     // const email = await sendEmail(Options)
//     const projectDeskOfficerEmail = await sendEmail(projectDeskOfficerOptions)
//     // console.log(`email: ${email}`)
//     console.log(`projectDeskOfficerEmail: ${projectDeskOfficerEmail}`)
//     return true
//   } catch (err) {
//     console.log(err)
//     return false
//   }
// })


// exports.projectNoObjectionEmailDepreciated = asyncHandler(async (projectInitiationInstance, req, res, next) => {
//   /**
//    * TODO: 
//    * • PPC portal sends email notification notifying the PDO to take action on the ‘issuance of SPN ‘ stage
//    */
//   // const contractEvaluation = await ProjectOnboarding.findById(contractEvaluationInstance._id).populate(
//   //   // "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
//   //   // assignedTo assignedBy createdBy updatedBy"
//   // )
//   const projectInitiation = await ProjectInitiation.findById(projectInitiationInstance.id).populate(populateProjectInitiation)

//   // const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)    
//   const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
//   const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
//   // const responsibleOfficer = await Staff.findById(projectInitiation.responsibleOfficer)
//   // const assignedBy = await Staff.findById(projectInitiation.assignedBy)
//   // // const assignedTo = await Staff.findById(projectInitiation.assignedTo)

//   // // For Assigned To Staff
//   // const Subject = `Project Task Assigned `
//   // const Salutation = `Hello,`
//   // const Message = `
//   //   Proposition testing
//   // `
//   // const Options = {
//   //   // to: [assignedTo.email], // email
//   //   // cc: [projectDeskOfficer.email, headOfProcurement.email], // cc
//   //   subject: Subject, // subject
//   //   text: Salutation, // message (salutation)
//   //   html: Message, // html
//   // }

//   // For Project Desk Officer
//   const projectDeskOfficerSubject = `Issuance of SPN Stage`
//   const projectDeskOfficerSalutation = `Hello,`
//   const projectDeskOfficerMessage = `
//     Kindly take action on the ‘issuance of SPN‘ stage.
//   `
//   const projectDeskOfficerOptions = {
//     to: [projectDeskOfficer.email], // email
//     cc: [headOfProcurement.email], // cc
//     subject: projectDeskOfficerSubject, // subject
//     text: projectDeskOfficerSalutation, // message (salutation)
//     html: projectDeskOfficerMessage, // html
//   }

//   // For Front Desk Officer
//   const frontDeskOfficerSubject = `SPN Deadline Date`
//   const frontDeskOfficerSalutation = `Hello,`
//   const frontDeskOfficerMessage = `
//     Kindly take action on the SPN Deadline date.
//   `
//   const frontDeskOfficerOptions = {
//     to: [frontDeskOfficer.email], // email
//     // cc: [headOfProcurement.email], // cc
//     subject: frontDeskOfficerSubject, // subject
//     text: frontDeskOfficerSalutation, // message (salutation)
//     html: frontDeskOfficerMessage, // html
//   }

//   try {
//     const projectDeskOfficerEmail = await sendEmail(projectDeskOfficerOptions)
//     const frontDeskOfficerEmail = await sendEmail(frontDeskOfficerOptions)
//     // console.log(`email: ${email}`)
//     console.log(`projectDeskOfficerEmail: ${projectDeskOfficerEmail}`)
//     console.log(`frontDeskOfficerEmail: ${frontDeskOfficerEmail}`)
//     return true
//   } catch (err) {
//     console.log(err)
//     return false
//   }
// })


// exports.projectIssuanceOfSPNEmailDepreciated = asyncHandler(async (projectInitiationInstance, req, res, next) => {
//   /**
//    * TODO: 
//    * • PPC portal sends email notification notifying the front desk to take action on the ‘Submission of Proposals ‘stage
//    */
//   // const contractEvaluation = await ProjectOnboarding.findById(contractEvaluationInstance._id).populate(
//   //   // "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
//   //   // assignedTo assignedBy createdBy updatedBy"
//   // )
//   const projectInitiation = await ProjectInitiation.findById(projectInitiationInstance.id).populate(populateProjectInitiation)

//   // const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)    
//   const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
//   const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
//   // const responsibleOfficer = await Staff.findById(projectInitiation.responsibleOfficer)
//   // const assignedBy = await Staff.findById(projectInitiation.assignedBy)
//   // // const assignedTo = await Staff.findById(projectInitiation.assignedTo)

//   // // For Assigned To Staff
//   // const Subject = `Project Task Assigned `
//   // const Salutation = `Hello,`
//   // const Message = `
//   //   Proposition testing
//   // `
//   // const Options = {
//   //   // to: [assignedTo.email], // email
//   //   // cc: [projectDeskOfficer.email, headOfProcurement.email], // cc
//   //   subject: Subject, // subject
//   //   text: Salutation, // message (salutation)
//   //   html: Message, // html
//   // }

//   // For Front Desk Officer
//   const frontDeskOfficerSubject = `Submission of Proposals Stage`
//   const frontDeskOfficerSalutation = `Hello,`
//   const frontDeskOfficerMessage = `
//     Kindly take action on the ‘Submission of Proposals‘ stage.
//   `
//   const frontDeskOfficerOptions = {
//     to: [frontDeskOfficer.email], // email
//     // cc: [headOfProcurement.email], // cc
//     subject: frontDeskOfficerSubject, // subject
//     text: frontDeskOfficerSalutation, // message (salutation)
//     html: frontDeskOfficerMessage, // html
//   }
//   try {
//     // const email = await sendEmail(Options)
//     const frontDeskOfficerEmail = await sendEmail(frontDeskOfficerOptions)
//     // console.log(`email: ${email}`)
//     console.log(`frontDeskOfficerEmail: ${frontDeskOfficerEmail}`)
//     return true
//   } catch (err) {
//     console.log(err)
//     return false
//   }
// })



// exports.projectSubmissionOfProposalsEmailDepreciated = asyncHandler(async (projectInitiationInstance, req, res, next) => {
//   /**
//    * TODO: 
//    * • PPC portal sends email notification notifying the HOP to take action on the ‘Evaluation ‘stage
//    */

//   const projectInitiation = await ProjectInitiation.findById(projectInitiationInstance.id).populate(populateProjectInitiation)

//   // For Head of Procurement
//   const Subject = `Evaluation Stage`
//   const Salutation = `Hello,`
//   const Message = `
//     Kindly take action on the ‘Evaluation‘ stage.
//   `
//   const Options = {
//     to: [projectInitiation.headOfProcurement.email], // email
//     cc: [projectInitiation.frontDeskOfficer.email], // cc
//     subject: Subject, // subject
//     text: Salutation, // message (salutation)
//     html: Message, // html
//   }
//   try {
//     // const email = await sendEmail(Options)
//     const Email = await sendEmail(Options)
//     // console.log(`email: ${email}`)
//     console.log(`Email: ${Email}`)
//     return true
//   } catch (err) {
//     console.log(err)
//     return false
//   }
// })


// // TODO: Add evaluating officer to the mail cc
// exports.projectBidOpeningExerciseEmailDepreciated = asyncHandler(async (projectInitiationInstance, req, res, next) => {
//   /**
//    * TODO: 
//    * • PPC portal sends email notification notifying the HOP to take action on the ‘Evaluation ‘stage
//    */

//   const projectInitiation = await ProjectInitiation.findById(projectInitiationInstance.id).populate(populateProjectInitiation)
//   const projectOnboarding = await ProjectOnboarding.find({project: projectOnboardingInstance._id}).populate(populateProjectOnboarding)
//   const contractEvaluation = await ContractEvaluation.find({project: projectOnboardingInstance._id}).populate(populateContractEvaluation)

//   // For Head of Procurement
//   const Subject = `Evaluation of Bids Stage`
//   const Salutation = `Hello,`
//   const Message = `
//     Kindly take action on the ‘Evaluation of Bids‘ stage.
//   `
//   const Options = {
//     to: [projectInitiation.headOfProcurement.email], // email
//     cc: [contractEvaluation.evaluatingOfficer.email], // cc
//     subject: Subject, // subject
//     text: Salutation, // message (salutation)
//     html: Message, // html
//   }
//   try {
//     const Email = await sendEmail(Options)
//     console.log(`Email: ${Email}`)
//     return true
//   } catch (err) {
//     console.log(err)
//     return false
//   }
// })


// exports.projectBidEvaluationEmailDepreciated = asyncHandler(async (contractEvaluationInstance, req, res, next) => {
//   /**
//    * TODO: 
//    * • PPC portal sends email notification notifying the evaluation team member to take action on the ‘Prepare contract award ‘stage
//    */

//   const evaluatingOfficer = await Staff.findById(contractEvaluationInstance.evaluatingOfficer)    

//   // For Evaluating Officer
//   let subject, message;
//   let salutation = `Hello,`
//   if (contractEvaluationInstance.score > 70) {
//     subject = `Prepare Contract Award Stage`
//     message = `Kindly take action on the ‘Prepare Contract Award‘ stage.`
//   } else {
//     subject = `Prepare Contract Termination Stage`
//     message = `Kindly take action on the ‘Prepare Contract Termination‘ stage.`
//   }
  
//   const options = {
//     to: [evaluatingOfficer.email], // email
//     // cc: [frontDeskOfficer.email], // cc
//     subject: subject, // subject
//     text: salutation, // message (salutation)
//     html: message, // html
//   }
//   try {
//     const email = await sendEmail(options)
//     console.log(`email: ${email}`)
//     return true
//   } catch (err) {
//     console.log(err)
//     return false
//   }
// })


// Technical Specification
// Cost Estimation
// Selection Method
// No Objection
// Issuance Of SPN
// Submission Of Proposals
// Bid Opening Exercise
// Bid Evaluation


exports.projectStageEmail = async (projectInitiation, subject, salutation, message, reciepients = [], cc = [], options = ["h", "f", "r"], updated = false) => {
  /**
   * @summary 
   *  PPC portal sends email notification notifying relevant staff for each stage of the project life cycle
   * 
   * @param options - Options for determining staff to be added to cc (["h", "f", "r", "u"])
   * 
   * @returns boolean
   */

  // const projectInitiation = await ProjectInitiation.findById(projectInitiation.id).populate(populateProjectInitiation)

  const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)
  const headOfProcurementEmail = getStaffEmail(headOfProcurement)
  const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
  const frontDeskOfficerEmail = getStaffEmail(frontDeskOfficer)
  const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
  const projectDeskOfficerEmail = getStaffEmail(projectDeskOfficer)
  const responsibleOfficer = await Staff.findById(projectInitiation.responsibleOfficer)
  const responsibleOfficerEmail = getStaffEmail(responsibleOfficer)

  if (projectDeskOfficerEmail) {reciepients.push(projectDeskOfficerEmail)}
  if ("h" in options && headOfProcurementEmail) {reciepients.push(headOfProcurementEmail)}
  if ("f" in options && frontDeskOfficerEmail) {cc.push(frontDeskOfficerEmail)}
  if ("r" in options && responsibleOfficerEmail) {cc.push(responsibleOfficerEmail)}

  const emailOptions = {
    to: reciepients, // email
    cc: cc, // cc
    subject: subject, // subject
    text: salutation, // message (salutation)
    html: message, // html
  }

  if (updated) {
    emailOptions.subject = `${emailOptions.subject} Update`

    emailOptions.html = `${emailOptions.subject} Documents have been updated`
  } else {
    // const createdBy = await Staff.findById(projectInitiation.createdBy)
    // emailOptions.cc.push(getStaffEmail(createdBy))
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