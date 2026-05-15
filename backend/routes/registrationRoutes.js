const express = require("express")
const router = express.Router()

const {
    registerForSport,
    getMyRegistrations,
    getParticipationStats,
    updateProfile
} = require("../controllers/registrationController")

const { protect } = require("../middleware/authMiddleware")

// Both routes require standard user authentication
router.get("/dashboard", protect, getParticipationStats)
router.patch("/profile", protect, updateProfile)
router.post("/", protect, registerForSport)
router.get("/my-registrations", protect, getMyRegistrations)

module.exports = router
