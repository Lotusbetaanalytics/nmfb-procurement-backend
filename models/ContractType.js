const mongoose = require("mongoose");

const ContractTypeSchema = new mongoose.Schema({

  title: {
    type: String,
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
