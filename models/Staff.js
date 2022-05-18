const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
  fullname: {
    type: String,
  },
  gender: {
    type: String,
  },
  dob: {
    type: String,
  },
  state: {
    type: String,
  },
  mobile: {
    type: String,
  },
  cug: {
    type: String,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please add Email"],
    unique: true,
  },
  department: {
    type: String,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  code: {
    type: String,
  },
  position: {
    type: String,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    // required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  isTeamHead: {
    type: Boolean,
    default: false,
  },
  isPDO: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isHOP: {
    type: Boolean,
    default: false,
  },
  files: {
    type: Array,
  },
  location: {
    type: String,
  },
  photo: {
    type: mongoose.Schema.ObjectId,
    ref: "Photo",
  },
  emergencyContactName: {
    type: String,
  },
  emergencyContactEmail: {
    type: String,
  },
  emergencyContactState: {
    type: String,
  },
  emergencyContactPhone: {
    type: String,
  },
  emergencyContactRelationship: {
    type: String,
  },
  emergencyContactAddress: {
    type: String,
  },
  calibrate: {
    type: Boolean,
    default: false,
  },
  resumptionDate: {type: String},
  bank: {type: String},
  accountName: {type: String},
  accountNumber: {type: String},
  nin: {type: String},
  bvn: {type: String},
  description: {type: String},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Staff", StaffSchema);
