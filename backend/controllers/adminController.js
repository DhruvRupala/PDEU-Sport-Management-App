const User           = require("../models/User")
const UniversityCode = require("../models/UniversityCode")
const Event          = require("../models/Event")
const Sport          = require("../models/Sport")
const Registration   = require("../models/Registration")
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

// ─── DASHBOARD ANALYTICS (comprehensive) ─────────────────────────
const getDashboardAnalytics = async (req, res) => {
  try {
    // ── User counts ──
    const [totalStudents, activeStudents, pendingUsers, rejectedUsers, totalManagers] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "student", status: "active" }),
      User.countDocuments({ status: "pending" }),
      User.countDocuments({ status: "rejected" }),
      User.countDocuments({ role: "manager" })
    ])

    // ── Event counts by status ──
    const [totalEvents, eventsOpenSoon, eventsRegOpen, eventsOngoing, eventsClosed] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ status: "open soon" }),
      Event.countDocuments({ status: "registration open" }),
      Event.countDocuments({ status: "ongoing" }),
      Event.countDocuments({ status: "closed" })
    ])

    // ── Registration & payment stats ──
    const [totalRegistrations, paymentsCompleted, paymentsPending, paymentsFailed] = await Promise.all([
      Registration.countDocuments(),
      Registration.countDocuments({ payment_status: "completed" }),
      Registration.countDocuments({ payment_status: "pending" }),
      Registration.countDocuments({ payment_status: "failed" })
    ])

    // ── Sport breakdown ──
    const [totalSports, individualSports, teamSports] = await Promise.all([
      Sport.countDocuments(),
      Sport.countDocuments({ type: "individual" }),
      Sport.countDocuments({ type: "team" })
    ])

    // ── Recent registrations (last 10) ──
    const recentRegistrations = await Registration.find()
      .populate("user_id", "name email university_name")
      .populate("event_id", "event_name event_type")
      .populate("sport_id", "sport_name type")
      .sort({ createdAt: -1 })
      .limit(10)

    // ── 7-day registration trend ──
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const trendData = await Registration.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    // Fill missing days with 0
    const trend = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo)
      d.setDate(d.getDate() + i)
      const key = d.toISOString().split("T")[0]
      const found = trendData.find(t => t._id === key)
      trend.push({
        date: key,
        label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        count: found ? found.count : 0
      })
    }

    // ── University distribution (top 8) ──
    const universityDist = await User.aggregate([
      { $match: { role: "student" } },
      { $group: { _id: "$university_name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ])

    res.json({
      users: { totalStudents, activeStudents, pendingUsers, rejectedUsers, totalManagers },
      events: { totalEvents, eventsOpenSoon, eventsRegOpen, eventsOngoing, eventsClosed },
      registrations: { totalRegistrations, paymentsCompleted, paymentsPending, paymentsFailed },
      sports: { totalSports, individualSports, teamSports },
      recentRegistrations,
      trend,
      universityDistribution: universityDist.map(u => ({ name: u._id || "Unknown", count: u.count }))
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getStats, getDashboardAnalytics,
  getPendingUsers, getAllUsers, updateUserStatus,
  getAllManagers, createManager, deleteManager,
  getUniversityCodes, createUniversityCode, toggleUniversityCode, deleteUniversityCode
}