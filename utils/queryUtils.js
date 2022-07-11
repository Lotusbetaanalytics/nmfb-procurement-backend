const {ErrorResponseJSON} = require("../utils/errorResponse");


exports.addUserDetails = async (req, updated = false) => {
  /**
   * @summary
   *  add authenticated user details to the request body
   * 
   * @param req - request object, for updating req.body
   * @param updated - specify if the details are for an update request
   */
  if (updated) {
    req.body.updatedBy = req.user._id
    req.body.updatedAt = Date.now()
  } else {
    req.body.name = req.user.fullname
    req.body.email = req.user.email
    req.body.createdBy = req.user._id
    req.body.createdAt = Date.now()
  }
}


exports.checkInstance = async (req, res, model, populate, query = {}, instanceName = "Instance") => {
    /**
   * @summary
   *  check if model instance exists, check if req.params.id exists and perform logic based on that
   * 
   * @param req - request object
   * @param res - response object
   * @param model - model for creating model instance
   * @param populate - query for populating model
   * @param query - query for filtering the model
   * @param instanceName - name to be used in error responses
   * 
   * @throws `Instance not Found!`, 404
   * @throws `This Instance already exists, update it instead!`, 400
   * 
   * @returns product initiation instance 
   */
  // instanceName = instanceName ? instanceName : "Instance"
  // console.log("model, populate, query, instanceName:", model, populate, query, instanceName)
  let instance;
  if (req.params.id) {
    instance = await model.findById(req.params.id).populate(populate)
  } else{
    instance = await model.find(query).populate(populate)
  }
  
  if (req.params.id && !instance) {
    return  new ErrorResponseJSON(res, `${instanceName} not Found!`, 404);
  } else if (!req.params.id && instance.length > 0) {
    return  new ErrorResponseJSON(res, `This ${instanceName} already exists, update it instead!`, 400);
  }
  return instance;
}
