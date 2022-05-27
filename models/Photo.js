const mongoose = require("mongoose");
const {defaultBase64Image} = require("../utils/generic")

const PhotoSchema = new mongoose.Schema({
  image: {
    type: String,
    default: defaultBase64Image,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Photo", PhotoSchema);
