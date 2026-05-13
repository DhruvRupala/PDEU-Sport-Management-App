const User           = require("../models/User")
const UniversityCode = require("../models/UniversityCode")
const bcrypt         = require("bcryptjs")

// ─── STATS (dashboard overview) ──────────────────────────────────
const getStats = async (req, res) => {
  try {
    const [totalUsers, pendingUsers, totalManagers] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ status: "pending" }),
      User.countDocuments({ role: "manager" })
    ])
    res.json({ totalUsers, pendingUsers, totalManagers })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── USERS: get all pending ───────────────────────────────────────
const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: "pending" })
      .select("-password")
      .sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── USERS: get all active students ──────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── USERS: approve or reject ────────────────────────────────────
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body  // "active" or "rejected"

    if (!["active", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select("-password")

    if (!user) return res.status(404).json({ message: "User not found" })
    res.json({ message: `User ${status}`, user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── MANAGERS: get all ───────────────────────────────────────────
const getAllManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: "manager" })
      .select("-password")
      .sort({ createdAt: -1 })
    res.json(managers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── MANAGERS: create ────────────────────────────────────────────
const createManager = async (req, res) => {
  try {
    const { name, email, password, phone, gender } = req.body

    if (!name || !email || !password || !phone || !gender) {
      return res.status(400).json({ message: "All fields required" })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: "Email already in use" })
    }

    const manager = await User.create({
      name, email, password, phone, gender,
      university_name: "PDEU",
      role: "manager",
      status: "active"   // admin-created → immediately active
    })

    res.status(201).json({ message: "Manager created", manager })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── MANAGERS: delete ────────────────────────────────────────────
const deleteManager = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: "Manager deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── UNIVERSITY CODES: get all ───────────────────────────────────
const getUniversityCodes = async (req, res) => {
  try {
    const codes = await UniversityCode.find().sort({ createdAt: -1 })
    res.json(codes)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── UNIVERSITY CODES: create ────────────────────────────────────
const createUniversityCode = async (req, res) => {
  try {
    const { university_name, code } = req.body
    if (!university_name || !code) {
      return res.status(400).json({ message: "University name and code required" })
    }
    const existing = await UniversityCode.findOne({ code })
    if (existing) {
      return res.status(400).json({ message: "Code already exists" })
    }
    const newCode = await UniversityCode.create({ university_name, code })
    res.status(201).json(newCode)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── UNIVERSITY CODES: toggle active ────────────────────────────
const toggleUniversityCode = async (req, res) => {
  try {
    const code = await UniversityCode.findById(req.params.id)
    if (!code) return res.status(404).json({ message: "Code not found" })
    code.is_active = !code.is_active
    await code.save()
    res.json({ message: `Code ${code.is_active ? "activated" : "deactivated"}`, code })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── UNIVERSITY CODES: delete ────────────────────────────────────
const deleteUniversityCode = async (req, res) => {
  try {
    await UniversityCode.findByIdAndDelete(req.params.id)
    res.json({ message: "Code deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getStats,
  getPendingUsers, getAllUsers, updateUserStatus,
  getAllManagers, createManager, deleteManager,
  getUniversityCodes, createUniversityCode, toggleUniversityCode, deleteUniversityCode
}