const {ErrorResponseJSON} = require("../utils/errorResponse");


exports.addUserDetails = async (req, updated = false) => {
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


exports.checkInstance = async (req, res, model, populate, query = {}, instanceName = undefined) => {
  instanceName = instanceName ? instanceName : "Instance"
  // console.log("model, populate, query, instanceName:", model, populate, query, instanceName)
  let instance;
  // if (req.params.id) {
  //   console.log("req.params.id:", req.params.id)
  //   instance = await model.findById(req.params.id)
  //   if (req.params.id && !instance) {
  //     console.log("Instance not found")
  //     throw new ErrorResponseJSON(res, `${instanceName} not Found!`, 404);
  //   }
  // } else{
  //   console.log("query:", query)
  //   instance = await model.find(query)
  //   console.log(instance)
  //   if (instance.length > 0) {
  //     console.log("Instance found return error")
  //     throw new ErrorResponseJSON(res, `This ${instanceName} already exists, update it instead!`, 400);
  //   }
  // }

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
