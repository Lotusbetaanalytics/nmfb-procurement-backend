const asyncHandler = require("../middleware/async");
const Blob = require("../models/Blob");
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse");
const {uploadBlob, getBlobs} = require("../utils/fileUtils");
const {addUserDetails, checkInstance} = require("../utils/queryUtils");


exports.populateBlob = "";


// @desc    Create Blob
// @route  POST /api/v1/blob
// @access   Private
exports.createBlob = asyncHandler(async (req, res, next) => {
  // check for existing blob instance
	await this.checkBlob(req, res, {title: req.body.title});

	const documentLinks = await uploadBlob(req);
	req.body.file = documentLinks;

	const blob = await Blob.create(req.body);
	if (!blob) {
		return new ErrorResponseJSON(res, "Blob not created!");
	}
	return new SuccessResponseJSON(res, blob, 201);
});


// @desc    Get all Blobs
// @route  GET /api/v1/blob
// @access   Public
exports.getAllBlobs = asyncHandler(async (req, res, next) => {
	return res.status(200).json(res.advancedResults);
});


// @desc    Get all Container Blobs
// @route  GET /api/v1/blob/container
// @access   Public
exports.getContainerBlobs = asyncHandler(async (req, res, next) => {
	const blobs = await getBlobs();
	return new SuccessResponseJSON(res, blobs);
});


// @desc    Get Blob
// @route  GET /api/v1/blob/:id
// @access   Private
exports.getBlob = asyncHandler(async (req, res, next) => {
	const blob = await this.checkBlob(req, res);
	return new SuccessResponseJSON(res, blob);
});


// @desc    Update Blob
// @route  PATCH /api/v1/blob/:id
// @access   Private
exports.updateBlob = asyncHandler(async (req, res, next) => {
	const blob = await Blob.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!blob) {
		return new ErrorResponseJSON(res, "Blob not updated!");
	}
	return new SuccessResponseJSON(res, blob);
});


// @desc    Delete Blob
// @route  DELETE /api/v1/blob/:id
// @access   Private
exports.deleteBlob = asyncHandler(async (req, res, next) => {
	const blob = await Blob.findByIdAndDelete(req.params.id);
	if (!blob) {
		return new ErrorResponseJSON(res, "Blob not found!");
	}
	return new SuccessResponseJSON(res, blob);
});


// @desc    Delete All Blobs
// @route  DELETE /api/v1/blob
// @access   Private
exports.deleteAllBlobs = asyncHandler(async (req, res, next) => {
	const blob = await Blob.deleteMany();
	return new SuccessResponseJSON(res, blob, 204);
});


exports.checkBlob = async (req, res, query = {}) => {
	/**
	 * @summary
	 *  check if Blob instance exists, check if req.params.id exists and perform logic based on that
	 *
	 * @throws `Blob not Found!`, 404
	 * @throws `This Blob already exists, update it instead!`, 400
	 *
	 * @returns Blob instance
	 */
	let blob = await checkInstance(req, res, Blob, this.populateBlob, query, "Blob");
	return blob;
};
