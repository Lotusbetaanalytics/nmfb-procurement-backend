const mongoose = require("mongoose");

const ContractSchema = new mongoose.Schema({

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

module.exports = mongoose.model("Contract", ContractSchema);