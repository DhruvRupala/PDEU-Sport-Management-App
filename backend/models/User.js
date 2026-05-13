const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({

  // Basic Info
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },

  // Academic Info
  roll_no: { type: String },
  university_name: { type: String, required: true },
  university_code: { type: String, default: null },

  // Role: student | manager | admin
  role: {
    type: String,
    enum: ["student", "manager", "admin"],
    default: "student"
  },

  // PDEU → active, non-PDEU → pending, manager → pending (needs admin approval)
  status: {
    type: String,
    enum: ["active", "pending", "rejected"],
    default: "pending"
  },

  // For non-PDEU: links to UniversityCode collection
  university_code_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UniversityCode",
    default: null
  }

}, { timestamps: true })

// Hash password before saving
userSchema.pre("save", async function() {
  if (!this.isModified("password")) return
  this.password = await bcrypt.hash(this.password, 10)
})

// Compare password helper
userSchema.methods.matchPassword = async function(entered) {
  return await bcrypt.compare(entered, this.password)
}

module.exports = mongoose.model("User", userSchema)