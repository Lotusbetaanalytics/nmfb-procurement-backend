const Staff = require("../models/Staff")
const { verify } = require("jsonwebtoken")
const {ErrorResponseJSON} = require("../utils/errorResponse")
const Role = require("../models/Role")
const Permission = require("../models/Permission")

  
exports.verifyToken = async (req, res, next) => {
  try {
    let token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]
    } else if (req.cookies.token) {
      token = req.cookies.token
    }

    if (!token) {
      return new ErrorResponseJSON(res, "You need to be logged in to perform this action.", 401)
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET) // Verify token
      // staff is returned when verifying the token
      // req.staff = decoded.staff
      req.user = await Staff.findById(decoded.staff).populate("team role") // the same as req.staff
  
      next()
    } catch (err) {
      return new ErrorResponseJSON(res, " Token is invalid.", 401)
    }
  } catch (err) {
    return new ErrorResponseJSON(res, "Not authorized to access this route", 401)
  }
}


// // Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role.title)) {
      return next(
        new ErrorResponseJSON(res, `User role ${req.user.role.title} is not authorized to access this route`, 403)
      )
    }
    next()
  }
}


// Grant access to specific roles using permissions
exports.hasPermission = (requiredPermission, userPermissions) => {
  return async (req, res, next) => {
    const permission = await Permission.findOne({title: requiredPermission})
    if (!permission) return new ErrorResponseJSON(res, `Invalid Permissions`, 401)
    if (!req.user) return new ErrorResponseJSON(res, `You are not authorized to access this route`, 401)
    if (!userPermissions) userPermissions = req.user.role.permissions
    // console.log(permission)
    // console.log(req.user)
    // console.log(userPermissions)
    if (!userPermissions.includes(permission._id)) {
      return next(
        new ErrorResponseJSON(res, `User role ${req.user.role.title} does not have the permission ${requiredPermission} to access this route`, 403)
      )
    }
    next()
  }
}
