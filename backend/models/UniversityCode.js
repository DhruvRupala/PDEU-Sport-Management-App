const mongoose = require("mongoose")

const universityCodeSchema = new mongoose.Schema({

  university_name: { type: String, required: true },

  // Unique code admin generates per university (e.g. "GTU2026")
  code: { type: String, required: true, unique: true },

  // Admin can deactivate a code to block future registrations
  is_active: { type: Boolean, default: true }

}, { timestamps: true })

module.exports = mongoose.model("UniversityCode", universityCodeSchema)