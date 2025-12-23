const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  role: {
    type: String,
    enum: ["candidate", "recruiter"],
    default: "candidate"
  },
  sector: String,

  resumePath: {
    type: String
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);