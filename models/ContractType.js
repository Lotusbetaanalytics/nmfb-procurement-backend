const mongoose = require("mongoose");

const ContractTypeSchema = new mongoose.Schema({
  /**
   * enum: ["New Contract", "Existing Contract"]
   */
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("ContractType", ContractTypeSchema);
