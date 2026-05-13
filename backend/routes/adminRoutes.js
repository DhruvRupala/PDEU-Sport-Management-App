const express = require("express")
const router  = express.Router()

const {
  getStats,
  getPendingUsers, getAllUsers, updateUserStatus,
  getAllManagers, createManager, deleteManager,
  getUniversityCodes, createUniversityCode, toggleUniversityCode, deleteUniversityCode
} = require("../controllers/adminController")

const { protect, adminOnly } = require("../middleware/authMiddleware")

// All admin routes are protected + admin only
router.use(protect, adminOnly)

// Stats
router.get("/stats", getStats)

// Users
router.get("/users", getAllUsers)
router.get("/users/pending", getPendingUsers)
router.patch("/users/:id/status", updateUserStatus)

// Managers
router.get("/managers", getAllManagers)
router.post("/managers", createManager)
router.delete("/managers/:id", deleteManager)

// University Codes
router.get("/university-codes", getUniversityCodes)
router.post("/university-codes", createUniversityCode)
router.patch("/university-codes/:id/toggle", toggleUniversityCode)
router.delete("/university-codes/:id", deleteUniversityCode)

module.exports = router