const Staff = require("../models/Staff")
const { verify } = require("jsonwebtoken")
const {ErrorResponseJSON} = require("../utils/errorResponse")
const Role = require("../models/Role")

  
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
      req.user = await Staff.findById(decoded.staff)
        // .populate("team role") // the same as req.staff
  
      next()
    } catch (err) {
      return new ErrorResponseJSON(res, " Token is invalid.", 401)
    }
  } catch (err) {
    return new ErrorResponseJSON(res, "Not authorized to access this route", 401)
  }
}


// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role.title)) {
      return next(
        new ErrorResponseJSON(res, `User role ${req.user.role} is not authorized to access this route`, 403)
      )
    }
    next()
  }
}
