const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["candidate", "recruiter", "admin"],
    required: true
  },
  sector: {
    type: String,
    required: function () {
      return this.role === "candidate";
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
