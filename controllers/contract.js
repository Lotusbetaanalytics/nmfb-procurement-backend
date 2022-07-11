const asyncHandler = require("../middleware/async");
const Contract = require("../models/Contract");
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse");
const {checkInstance} = require("../utils/queryUtils");


exports.populateContract = "createdBy updatedBy deactivatedBy";


// @desc    Create Contract
// @route  POST /api/v1/contract
// @access   Private
exports.createContract = asyncHandler(async (req, res, next) => {
	// check for existing contract instance
	await this.checkContract(req, res, {title: req.body.title});

	const contract = await Contract.create(req.body);
	if (!contract) {
		return new ErrorResponseJSON(res, "Contract not created!", 404);
	}
	return new SuccessResponseJSON(res, contract);
});


// @desc    Get all Contracts
// @route  GET /api/v1/contract
// @access   Public
exports.getAllContracts = asyncHandler(async (req, res, next) => {
	return res.status(200).json(res.advancedResults);
});


// @desc    Get Contract
// @route  GET /api/v1/contract/:id
// @access   Private
exports.getContract = asyncHandler(async (req, res, next) => {
	const contract = await this.checkContract(req, res);
	return new SuccessResponseJSON(res, contract);
});


// @desc    Update Contract
// @route  PATCH /api/v1/contract/:id
// @access   Private
exports.updateContract = asyncHandler(async (req, res, next) => {
	const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!contract) {
		return new ErrorResponseJSON(res, "Contract not updated!", 400);
	}
	return new SuccessResponseJSON(res, contract);
});


// @desc    Delete Contract
// @route  DELETE /api/v1/contract
// @access   Private
exports.deleteContract = asyncHandler(async (req, res, next) => {
	const contract = await Contract.findByIdAndDelete(req.params.id);
	if (!contract) {
		return new ErrorResponseJSON(res, "Contract not found!", 404);
	}
	return new SuccessResponseJSON(res, contract);
});


/**
// TODO: Replace these endpoints with the advanced results endpoint
// @desc    Get all Active Contracts
// @route  GET /api/v1/contract/active
// @access   Private
exports.getAllActiveContracts = asyncHandler(async (req, res, next) => {
    const contract = await Contract.find({isActive: true});
    return new SuccessResponseJSON(res, contract)
});


// @desc    Get all Terminated Contracts
// @route  GET /api/v1/contract/terminated
// @access   Private
exports.getAllTerminatedContracts = asyncHandler(async (req, res, next) => {
    const contract = await Contract.find({isActive: false});
    return new SuccessResponseJSON(res, contract)
});
 */


// @desc    Get all Failed Contracts (Score < 70)
// @route  GET /api/v1/contract/failed
// @access   Private
exports.getAllFailedContracts = asyncHandler(async (req, res, next) => {
	const contract = await Contract.find({score: {$lt: 70}});
	return new SuccessResponseJSON(res, contract);
});


// @desc    Terminate Contract
// @route  POST /api/v1/contract/:id/terminate
// @access   Private
exports.terminateContract = asyncHandler(async (req, res, next) => {
	const contract = await this.checkContract(req, res);

	if ((contract.score != 0 && contract.score < 70) || contract.isTerminated) {
		contract.isActive = false;
		contract.deactivatedBy = req.user._id;
		contract.deactivatedAt = Date.now();
		await contract.save();
	} else {
		return new ErrorResponseJSON(res, "Contract score greater than 70!", 400);
	}
	return new SuccessResponseJSON(res, contract);
});


exports.checkContract = async (req, res, query = {}) => {
	/**
	 * @summary
	 *  check if Contract instance exists, check if req.params.id exists and perform logic based on that
	 *
	 * @throws `Contract not Found!`, 404
	 * @throws `This Contract already exists, update it instead!`, 400
	 *
	 * @returns Contract instance
	 */
	let contract = await checkInstance(req, res, Contract, this.populateContract, query, "Contract");
	return contract;
};
