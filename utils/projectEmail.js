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


exports.projectOnboardingEmail = asyncHandler(async (projectOnboardInstance, req, res, next) => {
  /**
   * TODO: 
   * • If the selected contract type is ‘existing contract’ the system shall send an email notification to the PDO to specify evaluation officers and save the project to the ‘renewal list’ 
   * • If the selected contract type is ‘new’ the system shall send an email notification to the PDO with a link to scope the project and save the project to the ‘New project list’
   */
  const projectOnboarding = await ProjectOnboarding.findById(projectOnboardInstance._id).populate(
    "project contractType budgetLineItem projectCategory responsibleUnit responsibleOfficer \
    assignedTo assignedBy createdBy updatedBy"
  )
  const projectInitiation = await ProjectInitiation.findById(projectOnboardInstance.project).populate(
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
