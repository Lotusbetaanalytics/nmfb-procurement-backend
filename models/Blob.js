const mongoose = require("mongoose");

const Blob = new mongoose.Schema({
	title: String,
	file: Array,
});

module.exports = mongoose.model("Blob", Blob)
 