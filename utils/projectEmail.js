const asyncHandler = require("../middleware/async")
const ContractEvaluation = require("../models/ContractEvaluation")
const ProjectInitiation = require("../models/ProjectInitiation")
const ProjectOnboarding = require("../models/ProjectOnboarding")
const Staff = require("../models/Staff")
const {
  populateProjectInitiationDetails,
  populateProjectOnboardingDetails,
  populateProjectTaskDetails,
} = require("./projectUtils")
const {
  populateContractDetails,
  populateContractEvaluationDetails,
} = require("./contractUtils")
const sendEmail = require("./sendEmail")


exports.projectInitiationEmail = asyncHandler(async (projectInitiation, req, res, next) => {
  if (projectInitiation.createdBy == projectInitiation.headOfProcurement) {
    // TODO: Send mail to the HOP, PDO and Front desk officer
    // For HOP
    const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)
    const headOfProcurementSubject = `Project Initiation`
    const headOfProcurementSalutation = `Hello,`
    const headOfProcurementMessage = `
      Proposition testing
    `
    const headOfProcurementOptions = {
      to: [headOfProcurement.email], // email
      // cc: [frontDeskOfficer.email, projectDeskOfficer.email], // cc
      subject: headOfProcurementSubject, // subject
      text: headOfProcurementSalutation, // message (salutation)
      html: headOfProcurementMessage, // html
    }
    
    // For PDO and Front Desk Officer / Admin
    const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
    const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
    const frontDeskOfficerSubject = `Project Initiation`
    const frontDeskOfficerSalutation = `Hello,`
    const frontDeskOfficerMessage = `
      Proposition testing
    `
    const frontDeskOfficerOptions = {
      to: [frontDeskOfficer.email, projectDeskOfficer.email], // email
      // cc: [headOfProcurement.email], // cc
      subject: frontDeskOfficerSubject, // subject
      text: frontDeskOfficerSalutation, // message (salutation)
      html: frontDeskOfficerMessage, // html
    }
    try {
      const emailHOP = await sendEmail(headOfProcurementOptions)
      const emailFDO = await sendEmail(frontDeskOfficerOptions)
      console.log(`emailHOP: ${emailHOP}`)
      console.log(`emailFDO: ${emailFDO}`)
      return true
    } catch (err) {
      console.log(err)
      return false
    }

  } else if (projectInitiation.createdBy == projectInitiation.frontDeskOfficer) {
    // TODO: Send different mail to the HOP, PDO and Front desk officer
    // For HOP
    const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)
    const headOfProcurementSubject = `Project Initiation`
    const headOfProcurementSalutation = `Hello,`
    const headOfProcurementMessage = `
      Proposition testing
    `
    const headOfProcurementOptions = {
      to: [headOfProcurement.email], // email
      // cc: [frontDeskOfficer.email, projectDeskOfficer.email], // cc
      subject: headOfProcurementSubject, // subject
      text: headOfProcurementSalutation, // message (salutation)
      html: headOfProcurementMessage, // html
    }
    
    // For PDO and Front Desk Officer / Admin
    const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
    const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
    const frontDeskOfficerSubject = `Project Initiation`
    const frontDeskOfficerSalutation = `Hello,`
    const frontDeskOfficerMessage = `
      Proposition testing
    `
    const frontDeskOfficerOptions = {
      to: [frontDeskOfficer.email, projectDeskOfficer.email], // email
      // cc: [headOfProcurement.email], // cc
      subject: frontDeskOfficerSubject, // subject
      text: frontDeskOfficerSalutation, // message (salutation)
      html: frontDeskOfficerMessage, // html
    }
    try {
      const emailHOP = await sendEmail(headOfProcurementOptions)
      const emailFDO = await sendEmail(frontDeskOfficerOptions)
      console.log(`emailHOP: ${emailHOP}`)
      console.log(`emailFDO: ${emailFDO}`)
      return true
    } catch (err) {
      console.log(err)
      return false
    }


  } else {
    console.log(`Project Initiated Improperly`)
    // Do stuff to the project initiation
    return false
  }
})


exports.projectInitiationUpdateEmail = asyncHandler(async (projectInitiation, req, res, next) => {
  const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)
  const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
  const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
  const updatedBy = await Staff.findById(projectInitiation.updatedBy)

  const subject = `Project Initiation Update`
  const salutation = `Hello,`
  const message = `
    Proposition testing
  `
  const options = {
    to: [headOfProcurement.email, frontDeskOfficer.email, projectDeskOfficer.email], // email
    cc: [updatedBy.email], // cc
    subject: subject, // subject
    text: salutation, // message (salutation)
    html: message, // html
  }
  try {
    const email = await sendEmail(options)
    console.log(`email: ${email}`)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
})


exports.projectOnboardingEmail = asyncHandler(async (projectOnboardingInstance, req, res, next) => {
  /**
   * TODO: 
   * • If the selected contract type is ‘existing contract’ the system shall send an email notification to the PDO to specify evaluation officers and save the project to the ‘renewal list’ 
   * • If the selected contract type is ‘new’ the system shall send an email notification to the PDO with a link to scope the project and save the project to the ‘New project list’
   */
  const projectOnboarding = await ProjectOnboarding.findById(projectOnboardingInstance._id).populate(populateProjectOnboardingDetails)
  const projectInitiation = await ProjectInitiation.findById(projectOnboardingInstance.project).populate(populateProjectInitiationDetails)

  // const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)    
  // const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
  const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
  
  if (projectOnboarding.contractType.title == "Existing Contract") {
    // TODO: Send mail to the HOP, PDO and Front desk officer
    // For HOP, PDO and Front Desk Officer / Admin
    
    const Subject = `Project Onboarding and Contract Evaluation `
    const Salutation = `Hello,`
    const Message = `
      Proposition testing
    `
    const Options = {
      to: [projectDeskOfficer.email], // email
      // cc: [frontDeskOfficer.email, headOfProcurement.email], // cc
      subject: Subject, // subject
      text: Salutation, // message (salutation)
      html: Message, // html
    }
    try {
      const email = await sendEmail(Options)
      console.log(`email: ${email}`)
      return true
    } catch (err) {
      console.log(err)
      return false
    }

  } else if (projectOnboarding.contractType.title == "New Contract") {
    // TODO: Send mail to the HOP, PDO and Front desk officer
    // For HOP, PDO and Front Desk Officer / Admin
    
    const Subject = `Project Onboarding with New Contract and Scope`
    const Salutation = `Hello,`
    const Message = `
      Proposition testing
    `
    const Options = {
      to: [projectDeskOfficer.email], // email
      // cc: [frontDeskOfficer.email, headOfProcurement.email], // cc
      subject: Subject, // subject
      text: Salutation, // message (salutation)
      html: Message, // html
    }
    try {
      const email = await sendEmail(Options)
      console.log(`email: ${email}`)
      return true
    } catch (err) {
      console.log(err)
      return false
    }

  } else {
    console.log(`Project Onboarded Improperly`)
    // Do stuff to the project initiation
    return false
  }
})


exports.projectOnboardingUpdateEmail = asyncHandler(async (projectOnboardingInstance, req, res, next) => {
  const projectInitiation = await ProjectInitiation.findById(projectOnboardingInstance.project).populate(populateProjectInitiationDetails)
  const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)
  const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
  const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
  const updatedBy = await Staff.findById(projectOnboardingInstance.updatedBy)

  const subject = `Project Onboarding Update`
  const salutation = `Hello,`
  const message = `
    Proposition testing
  `
  const options = {
    to: [headOfProcurement.email, frontDeskOfficer.email, projectDeskOfficer.email], // email
    cc: [updatedBy.email], // cc
    subject: subject, // subject
    text: salutation, // message (salutation)
    html: message, // html
  }
  try {
    const email = await sendEmail(options)
    console.log(`email: ${email}`)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
})


exports.projectAssignmentEmail = asyncHandler(async (projectInitiationInstance, req, res, next) => {
  /**
   * Summary: Send Email to the responsible officer when the head of procurement assigns a project
   * TODO: 
   * • PPC portal forwards project to the responsible officer and send email notification to the responsible officer and head of procurement.
   */
  const projectInitiation = await ProjectInitiation.findById(projectInitiationInstance._id).populate(
    "contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement responsibleOfficer createdBy updatedBy"
  ) // const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)

  const subject = `Project Assigned `
  const salutation = `Hello,`
  const message = `
    Proposition testing
  `
  const options = {
    to: [projectInitiation.responsibleOfficer.email], // email
    cc: [projectInitiation.headOfProcurement.email], // cc
    subject: subject, // subject
    text: salutation, // (salutation)
    html: message, // html
  }
  try {
    const email = await sendEmail(options)
    console.log(`email: ${email}`)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
})


exports.projectTaskAssignmentEmail = asyncHandler(async (projectTaskInstance, req, res, next) => {
  /**
   * TODO: 
   * • PPC portal saves status in pending list, forwards request to the responsible officer and send email notification to the responsible officer and the head of team
   */
  // const contractEvaluation = await ProjectOnboarding.findById(contractEvaluationInstance._id).populate(
  //   // "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
  //   // assignedTo assignedBy createdBy updatedBy"
  // )
  const projectInitiation = await ProjectInitiation.findById(projectTaskInstance.project).populate(populateProjectInitiationDetails)

  // const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)    
  // const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
  // const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
  const responsibleOfficer = await Staff.findById(projectTaskInstance.responsibleOfficer)
  const assignedBy = await Staff.findById(projectTaskInstance.assignedBy)
  const assignedTo = await Staff.findById(projectTaskInstance.assignedTo)

  // For Assigned To Staff
  const Subject = `Project Task Assigned `
  const Salutation = `Hello,`
  const Message = `
    Proposition testing
  `
  const Options = {
    to: [assignedTo.email], // email
    // cc: [projectDeskOfficer.email, headOfProcurement.email], // cc
    subject: Subject, // subject
    text: Salutation, // message (salutation)
    html: Message, // html
  }

  // For Responsible Officer and Assigned By Staff
  const responsibleOfficerSubject = `Project Task Assigned `
  const responsibleOfficerSalutation = `Hello,`
  const responsibleOfficerMessage = `
    Proposition testing
  `
  const responsibleOfficerOptions = {
    to: [responsibleOfficer.email], // email
    cc: [assignedBy.email], // cc
    subject: responsibleOfficerSubject, // subject
    text: responsibleOfficerSalutation, // message (salutation)
    html: responsibleOfficerMessage, // html
  }
  try {
    const email = await sendEmail(Options)
    const responsibleOfficerEmail = await sendEmail(responsibleOfficerOptions)
    console.log(`email: ${email}`)
    console.log(`responsibleOfficerEmail: ${responsibleOfficerEmail}`)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
  
})


exports.projectTaskReassignmentEmail = asyncHandler(async (projectTaskInstance, req, res, next) => {
  /**
   * TODO: 
   * • PPC portal saves status in pending list, forwards request to the responsible officer and send email notification to the responsible officer and the head of team
   */
  // const contractEvaluation = await ProjectOnboarding.findById(contractEvaluationInstance._id).populate(
  //   // "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
  //   // assignedTo assignedBy createdBy updatedBy"
  // )
  const projectInitiation = await ProjectInitiation.findById(projectTaskInstance.project).populate(populateProjectInitiationDetails)

  // const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)    
  // const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
  // const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
  const responsibleOfficer = await Staff.findById(projectTaskInstance.responsibleOfficer)
  const assignedBy = await Staff.findById(projectTaskInstance.assignedBy)
  const assignedTo = await Staff.findById(projectTaskInstance.assignedTo)
  const reassignedTo = await Staff.findById(projectTaskInstance.reassignedTo)

  // For Assigned To Staff
  const Subject = `Project Task ReAssigned `
  const Salutation = `Hello,`
  const Message = `
    Proposition testing
  `
  const Options = {
    to: [reassignedTo.email], // email
    cc: [assignedTo.email, assignedBy.email], // cc
    subject: Subject, // subject
    text: Salutation, // message (salutation)
    html: Message, // html
  }

  // For Responsible Officer and Assigned By Staff
  const responsibleOfficerSubject = `Project Task ReAssigned `
  const responsibleOfficerSalutation = `Hello,`
  const responsibleOfficerMessage = `
    Proposition testing
  `
  const responsibleOfficerOptions = {
    to: [responsibleOfficer.email], // email
    cc: [assignedBy.email], // cc
    subject: responsibleOfficerSubject, // subject
    text: responsibleOfficerSalutation, // message (salutation)
    html: responsibleOfficerMessage, // html
  }
  try {
    const email = await sendEmail(Options)
    const responsibleOfficerEmail = await sendEmail(responsibleOfficerOptions)
    console.log(`email: ${email}`)
    console.log(`responsibleOfficerEmail: ${responsibleOfficerEmail}`)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
  
})


exports.projectTechnicalSpecificationEmail = asyncHandler(async (projectInitiationInstance, req, res, next) => {
  /**
   * TODO: 
   * • PPC portal forwards project to the responsible officer and send email notification to the responsible officer and head of procurement.
   */
  // const contractEvaluation = await ProjectOnboarding.findById(contractEvaluationInstance._id).populate(
  //   // "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
  //   // assignedTo assignedBy createdBy updatedBy"
  // )
  const projectInitiation = await ProjectInitiation.findById(projectInitiationInstance.id).populate(populateProjectInitiationDetails)

  const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)    
  // const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
  // const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
  const responsibleOfficer = await Staff.findById(projectInitiation.responsibleOfficer)
  // const assignedBy = await Staff.findById(projectInitiation.assignedBy)
  // // const assignedTo = await Staff.findById(projectInitiation.assignedTo)

  // // For Assigned To Staff
  // const Subject = `Project Task Assigned `
  // const Salutation = `Hello,`
  // const Message = `
  //   Proposition testing
  // `
  // const Options = {
  //   // to: [assignedTo.email], // email
  //   // cc: [projectDeskOfficer.email, headOfProcurement.email], // cc
  //   subject: Subject, // subject
  //   text: Salutation, // message (salutation)
  //   html: Message, // html
  // }

  // For Responsible Officer
  const responsibleOfficerSubject = `Project Technical Specifications / Scope `
  const responsibleOfficerSalutation = `Hello,`
  const responsibleOfficerMessage = `
    Proposition testing
  `
  const responsibleOfficerOptions = {
    to: [responsibleOfficer.email], // email
    cc: [headOfProcurement.email], // cc
    subject: responsibleOfficerSubject, // subject
    text: responsibleOfficerSalutation, // message (salutation)
    html: responsibleOfficerMessage, // html
  }
  try {
    // const email = await sendEmail(Options)
    const responsibleOfficerEmail = await sendEmail(responsibleOfficerOptions)
    // console.log(`email: ${email}`)
    console.log(`responsibleOfficerEmail: ${responsibleOfficerEmail}`)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
  
})


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


exports.projectCostEstimationEmail = asyncHandler(async (projectInitiationInstance, req, res, next) => {
  /**
   * TODO: 
   * • PPC portal sends email notification notifying the PDO to take action on the ‘selection method ‘ stage
   */
  // const contractEvaluation = await ProjectOnboarding.findById(contractEvaluationInstance._id).populate(
  //   // "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
  //   // assignedTo assignedBy createdBy updatedBy"
  // )
  const projectInitiation = await ProjectInitiation.findById(projectInitiationInstance.id).populate(populateProjectInitiationDetails)

  // const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)    
  // const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
  const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
  // const responsibleOfficer = await Staff.findById(projectInitiation.responsibleOfficer)
  // const assignedBy = await Staff.findById(projectInitiation.assignedBy)
  // // const assignedTo = await Staff.findById(projectInitiation.assignedTo)

  // // For Assigned To Staff
  // const Subject = `Project Task Assigned `
  // const Salutation = `Hello,`
  // const Message = `
  //   Proposition testing
  // `
  // const Options = {
  //   // to: [assignedTo.email], // email
  //   // cc: [projectDeskOfficer.email, headOfProcurement.email], // cc
  //   subject: Subject, // subject
  //   text: Salutation, // message (salutation)
  //   html: Message, // html
  // }

  // For Project Desk Officer
  const projectDeskOfficerSubject = `Selection Method Stage`
  const projectDeskOfficerSalutation = `Hello,`
  const projectDeskOfficerMessage = `
    Kindly take action on the ‘selection method‘ stage.
  `
  const projectDeskOfficerOptions = {
    to: [projectDeskOfficer.email], // email
    // cc: [headOfProcurement.email], // cc
    subject: projectDeskOfficerSubject, // subject
    text: projectDeskOfficerSalutation, // message (salutation)
    html: projectDeskOfficerMessage, // html
  }
  try {
    // const email = await sendEmail(Options)
    const projectDeskOfficerEmail = await sendEmail(projectDeskOfficerOptions)
    // console.log(`email: ${email}`)
    console.log(`projectDeskOfficerEmail: ${projectDeskOfficerEmail}`)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
  
})


// TODO: Use projectCostEstimationEmail as a template for all document upload emails 

exports.projectSelectionMethodEmail = asyncHandler(async (projectInitiationInstance, req, res, next) => {
  /**
   * TODO: 
   * • PPC portal sends email notification notifying the PDO to take action on the ‘no objection ‘ stage
   */
  // const contractEvaluation = await ProjectOnboarding.findById(contractEvaluationInstance._id).populate(
  //   // "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
  //   // assignedTo assignedBy createdBy updatedBy"
  // )
  const projectInitiation = await ProjectInitiation.findById(projectInitiationInstance.id).populate(populateProjectInitiationDetails)

  // const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)    
  // const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
  const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
  // const responsibleOfficer = await Staff.findById(projectInitiation.responsibleOfficer)
  // const assignedBy = await Staff.findById(projectInitiation.assignedBy)
  // // const assignedTo = await Staff.findById(projectInitiation.assignedTo)

  // // For Assigned To Staff
  // const Subject = `Project Task Assigned `
  // const Salutation = `Hello,`
  // const Message = `
  //   Proposition testing
  // `
  // const Options = {
  //   // to: [assignedTo.email], // email
  //   // cc: [projectDeskOfficer.email, headOfProcurement.email], // cc
  //   subject: Subject, // subject
  //   text: Salutation, // message (salutation)
  //   html: Message, // html
  // }

  // For Project Desk Officer
  const projectDeskOfficerSubject = `No Objection Stage`
  const projectDeskOfficerSalutation = `Hello,`
  const projectDeskOfficerMessage = `
    Kindly take action on the ‘no objection‘ stage.
  `
  const projectDeskOfficerOptions = {
    to: [projectDeskOfficer.email], // email
    // cc: [headOfProcurement.email], // cc
    subject: projectDeskOfficerSubject, // subject
    text: projectDeskOfficerSalutation, // message (salutation)
    html: projectDeskOfficerMessage, // html
  }
  try {
    // const email = await sendEmail(Options)
    const projectDeskOfficerEmail = await sendEmail(projectDeskOfficerOptions)
    // console.log(`email: ${email}`)
    console.log(`projectDeskOfficerEmail: ${projectDeskOfficerEmail}`)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
})


exports.projectNoObjectionEmail = asyncHandler(async (projectInitiationInstance, req, res, next) => {
  /**
   * TODO: 
   * • PPC portal sends email notification notifying the PDO to take action on the ‘issuance of SPN ‘ stage
   */
  // const contractEvaluation = await ProjectOnboarding.findById(contractEvaluationInstance._id).populate(
  //   // "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
  //   // assignedTo assignedBy createdBy updatedBy"
  // )
  const projectInitiation = await ProjectInitiation.findById(projectInitiationInstance.id).populate(populateProjectInitiationDetails)

  // const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)    
  const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
  const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
  // const responsibleOfficer = await Staff.findById(projectInitiation.responsibleOfficer)
  // const assignedBy = await Staff.findById(projectInitiation.assignedBy)
  // // const assignedTo = await Staff.findById(projectInitiation.assignedTo)

  // // For Assigned To Staff
  // const Subject = `Project Task Assigned `
  // const Salutation = `Hello,`
  // const Message = `
  //   Proposition testing
  // `
  // const Options = {
  //   // to: [assignedTo.email], // email
  //   // cc: [projectDeskOfficer.email, headOfProcurement.email], // cc
  //   subject: Subject, // subject
  //   text: Salutation, // message (salutation)
  //   html: Message, // html
  // }

  // For Project Desk Officer
  const projectDeskOfficerSubject = `Issuance of SPN Stage`
  const projectDeskOfficerSalutation = `Hello,`
  const projectDeskOfficerMessage = `
    Kindly take action on the ‘issuance of SPN‘ stage.
  `
  const projectDeskOfficerOptions = {
    to: [projectDeskOfficer.email], // email
    cc: [headOfProcurement.email], // cc
    subject: projectDeskOfficerSubject, // subject
    text: projectDeskOfficerSalutation, // message (salutation)
    html: projectDeskOfficerMessage, // html
  }

  // For Front Desk Officer
  const frontDeskOfficerSubject = `SPN Deadline Date`
  const frontDeskOfficerSalutation = `Hello,`
  const frontDeskOfficerMessage = `
    Kindly take action on the SPN Deadline date.
  `
  const frontDeskOfficerOptions = {
    to: [frontDeskOfficer.email], // email
    // cc: [headOfProcurement.email], // cc
    subject: frontDeskOfficerSubject, // subject
    text: frontDeskOfficerSalutation, // message (salutation)
    html: frontDeskOfficerMessage, // html
  }

  try {
    const projectDeskOfficerEmail = await sendEmail(projectDeskOfficerOptions)
    const frontDeskOfficerEmail = await sendEmail(frontDeskOfficerOptions)
    // console.log(`email: ${email}`)
    console.log(`projectDeskOfficerEmail: ${projectDeskOfficerEmail}`)
    console.log(`frontDeskOfficerEmail: ${frontDeskOfficerEmail}`)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
})


exports.projectIssuanceOfSPNEmail = asyncHandler(async (projectInitiationInstance, req, res, next) => {
  /**
   * TODO: 
   * • PPC portal sends email notification notifying the front desk to take action on the ‘Submission of Proposals ‘stage
   */
  // const contractEvaluation = await ProjectOnboarding.findById(contractEvaluationInstance._id).populate(
  //   // "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
  //   // assignedTo assignedBy createdBy updatedBy"
  // )
  const projectInitiation = await ProjectInitiation.findById(projectInitiationInstance.id).populate(populateProjectInitiationDetails)

  // const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)    
  const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
  const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
  // const responsibleOfficer = await Staff.findById(projectInitiation.responsibleOfficer)
  // const assignedBy = await Staff.findById(projectInitiation.assignedBy)
  // // const assignedTo = await Staff.findById(projectInitiation.assignedTo)

  // // For Assigned To Staff
  // const Subject = `Project Task Assigned `
  // const Salutation = `Hello,`
  // const Message = `
  //   Proposition testing
  // `
  // const Options = {
  //   // to: [assignedTo.email], // email
  //   // cc: [projectDeskOfficer.email, headOfProcurement.email], // cc
  //   subject: Subject, // subject
  //   text: Salutation, // message (salutation)
  //   html: Message, // html
  // }

  // For Front Desk Officer
  const frontDeskOfficerSubject = `Submission of Proposals Stage`
  const frontDeskOfficerSalutation = `Hello,`
  const frontDeskOfficerMessage = `
    Kindly take action on the ‘Submission of Proposals‘ stage.
  `
  const frontDeskOfficerOptions = {
    to: [frontDeskOfficer.email], // email
    // cc: [headOfProcurement.email], // cc
    subject: frontDeskOfficerSubject, // subject
    text: frontDeskOfficerSalutation, // message (salutation)
    html: frontDeskOfficerMessage, // html
  }
  try {
    // const email = await sendEmail(Options)
    const frontDeskOfficerEmail = await sendEmail(frontDeskOfficerOptions)
    // console.log(`email: ${email}`)
    console.log(`frontDeskOfficerEmail: ${frontDeskOfficerEmail}`)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
})



exports.projectSubmissionOfProposalsEmail = asyncHandler(async (projectInitiationInstance, req, res, next) => {
  /**
   * TODO: 
   * • PPC portal sends email notification notifying the HOP to take action on the ‘Evaluation ‘stage
   */

  const projectInitiation = await ProjectInitiation.findById(projectInitiationInstance.id).populate(populateProjectInitiationDetails)

  // For Head of Procurement
  const Subject = `Evaluation Stage`
  const Salutation = `Hello,`
  const Message = `
    Kindly take action on the ‘Evaluation‘ stage.
  `
  const Options = {
    to: [projectInitiation.headOfProcurement.email], // email
    cc: [projectInitiation.frontDeskOfficer.email], // cc
    subject: Subject, // subject
    text: Salutation, // message (salutation)
    html: Message, // html
  }
  try {
    // const email = await sendEmail(Options)
    const Email = await sendEmail(Options)
    // console.log(`email: ${email}`)
    console.log(`Email: ${Email}`)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
})


// TODO: Add evaluating officer to the mail cc
exports.projectBidOpeningExerciseEmail = asyncHandler(async (projectInitiationInstance, req, res, next) => {
  /**
   * TODO: 
   * • PPC portal sends email notification notifying the HOP to take action on the ‘Evaluation ‘stage
   */

  const projectInitiation = await ProjectInitiation.findById(projectInitiationInstance.id).populate(populateProjectInitiationDetails)
  const projectOnboarding = await ProjectOnboarding.find({project: projectOnboardingInstance._id}).populate(populateProjectOnboardingDetails)
  const contractEvaluation = await ContractEvaluation.find({project: projectOnboardingInstance._id}).populate(populateContractEvaluationDetails)

  // For Head of Procurement
  const Subject = `Evaluation of Bids Stage`
  const Salutation = `Hello,`
  const Message = `
    Kindly take action on the ‘Evaluation of Bids‘ stage.
  `
  const Options = {
    to: [projectInitiation.headOfProcurement.email], // email
    cc: [contractEvaluation.evaluatingOfficer.email], // cc
    subject: Subject, // subject
    text: Salutation, // message (salutation)
    html: Message, // html
  }
  try {
    const Email = await sendEmail(Options)
    console.log(`Email: ${Email}`)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
})


exports.projectBidEvaluationEmail = asyncHandler(async (contractEvaluationInstance, req, res, next) => {
  /**
   * TODO: 
   * • PPC portal sends email notification notifying the evaluation team member to take action on the ‘Prepare contract award ‘stage
   */

  const evaluatingOfficer = await Staff.findById(contractEvaluationInstance.evaluatingOfficer)    

  // For Evaluating Officer
  let subject, message;
  let salutation = `Hello,`
  if (contractEvaluationInstance.score > 70) {
    subject = `Prepare Contract Award Stage`
    message = `Kindly take action on the ‘Prepare Contract Award‘ stage.`
  } else {
    subject = `Prepare Contract Termination Stage`
    message = `Kindly take action on the ‘Prepare Contract Termination‘ stage.`
  }
  
  const options = {
    to: [evaluatingOfficer.email], // email
    // cc: [frontDeskOfficer.email], // cc
    subject: subject, // subject
    text: salutation, // message (salutation)
    html: message, // html
  }
  try {
    const email = await sendEmail(options)
    console.log(`email: ${email}`)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
})

// Technical Specification
// Cost Estimation
// Selection Method
// No Objection
// Issuance Of SPN
// Submission Of Proposals
// Bid Opening Exercise
// Bid Evaluation