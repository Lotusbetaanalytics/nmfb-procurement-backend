const asyncHandler = require("../middleware/async")
const Blob = require("../models/Blob")
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse")
const {uploadBlob, getBlobs} = require("../utils/fileUtils")


exports.populateBlob = undefined


// @desc    Create Blob
// @route  POST /api/v1/blob
// @access   Private
exports.createBlob = asyncHandler(async (req, res, next) => {
  const existingBlob = await Blob.find({title: req.body.title})

  if (existingBlob.length > 0) {
    return new ErrorResponseJSON(res, "This blob already exists, update it instead!", 400)
  }

  const documentLinks = await uploadBlob(req)
  console.log(documentLinks)

  req.body.file = documentLinks

  const blob = await Blob.create(req.body)
  if (!blob) {
    return new ErrorResponseJSON(res, "Blob not created!")
  }
  return new SuccessResponseJSON(res, blob, 201)
})


// @desc    Get all Blobs
// @route  GET /api/v1/blob
// @access   Public
exports.getAllBlobs = asyncHandler(async (req, res, next) => {
  // const blobs = await getBlobs()
  // return new SuccessResponseJSON(res, blobs)
  return res.status(200).json(res.advancedResults)
})


// @desc    Get all Container Blobs
// @route  GET /api/v1/blob/container
// @access   Public
exports.getContainerBlobs = asyncHandler(async (req, res, next) => {
  const blobs = await getBlobs()
  return new SuccessResponseJSON(res, blobs)
  // return res.status(200).json(res.advancedResults)
})


// @desc    Get Blob
// @route  GET /api/v1/blob/:id
// @access   Private
exports.getBlob = asyncHandler(async (req, res, next) => {
  const blob = await Blob.findById(req.params.id).populate(this.populateBlob)
  if (!blob) {
    return new ErrorResponseJSON(res, "Blob not found!")
  }
  return new SuccessResponseJSON(res, blob)
})


// @desc    Update Blob
// @route  PATCH /api/v1/blob/:id
// @access   Private
exports.updateBlob = asyncHandler(async (req, res, next) => {
  const blob = await Blob.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!blob) {
    return new ErrorResponseJSON(res, "Blob not updated!")
  }
  return new SuccessResponseJSON(res, blob)
})


// @desc    Delete Blob
// @route  DELETE /api/v1/blob/:id
// @access   Private
exports.deleteBlob = asyncHandler(async (req, res, next) => {
  const blob = await Blob.findByIdAndDelete(req.params.id)
  if (!blob) {
    return new ErrorResponseJSON(res, "Blob not found!")
  }
  return new SuccessResponseJSON(res, blob)
})


// @desc    Delete All Blobs
// @route  DELETE /api/v1/blob
// @access   Private
exports.deleteAllBlobs = asyncHandler(async (req, res, next) => {
  const blob = await Blob.deleteMany()

  return new SuccessResponseJSON(res, blob, 204)
})