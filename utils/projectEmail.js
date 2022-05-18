const asyncHandler = require("../middleware/async")
const ContractEvaluation = require("../models/ContractEvaluation")
const ProjectInitiation = require("../models/ProjectInitiation")
const ProjectOnboarding = require("../models/ProjectOnboarding")
const Staff = require("../models/Staff")
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
  const projectOnboarding = await ProjectOnboarding.findById(projectOnboardingInstance._id).populate(
    "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
    assignedTo assignedBy createdBy updatedBy"
  )
  const projectInitiation = await ProjectInitiation.findById(projectOnboardingInstance.project).populate(
    "contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy"
  )

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
  const projectInitiation = await ProjectInitiation.findById(projectOnboardingInstance.project).populate(
    "contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy"
  )
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


exports.projectAssignmentEmail = asyncHandler(async (projectOnboardingInstance, req, res, next) => {
  /**
   * TODO: 
   * • PPC portal forwards project to the responsible officer and send email notification to the responsible officer and head of procurement.
   */
  // const contractEvaluation = await ProjectOnboarding.findById(contractEvaluationInstance._id).populate(
  //   // "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
  //   // assignedTo assignedBy createdBy updatedBy"
  // )
  const projectInitiation = await ProjectInitiation.findById(projectOnboardingInstance.project).populate(
    "contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy"
  )

  const headOfProcurement = await Staff.findById(projectInitiation.headOfProcurement)    
  // const frontDeskOfficer = await Staff.findById(projectInitiation.frontDeskOfficer)
  // const projectDeskOfficer = await Staff.findById(projectInitiation.projectDeskOfficer)
  const responsibleOfficer = await Staff.findById(projectOnboardingInstance.responsibleOfficer)
  // const assignedBy = await Staff.findById(projectOnboardingInstance.assignedBy)
  // // const assignedTo = await Staff.findById(projectOnboardingInstance.assignedTo)

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
  const responsibleOfficerSubject = `Project Assigned `
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


exports.projectTaskAssignmentEmail = asyncHandler(async (projectTaskInstance, req, res, next) => {
  /**
   * TODO: 
   * • PPC portal saves status in pending list, forwards request to the responsible officer and send email notification to the responsible officer and the head of team
   */
  // const contractEvaluation = await ProjectOnboarding.findById(contractEvaluationInstance._id).populate(
  //   // "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
  //   // assignedTo assignedBy createdBy updatedBy"
  // )
  const projectInitiation = await ProjectInitiation.findById(projectTaskInstance.project).populate(
    "contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy"
  )

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
  const projectInitiation = await ProjectInitiation.findById(projectTaskInstance.project).populate(
    "contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy"
  )

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


exports.projectTechnicalSpecificationUploadEmail = asyncHandler(async (projectInitiationInstance, req, res, next) => {
  /**
   * TODO: 
   * • PPC portal forwards project to the responsible officer and send email notification to the responsible officer and head of procurement.
   */
  // const contractEvaluation = await ProjectOnboarding.findById(contractEvaluationInstance._id).populate(
  //   // "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
  //   // assignedTo assignedBy createdBy updatedBy"
  // )
  const projectInitiation = await ProjectInitiation.findById(projectInitiationInstance.id).populate(
    "contractType contract projectDeskOfficer frontDeskOfficer headOfProcurement createdBy updatedBy"
  )

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


