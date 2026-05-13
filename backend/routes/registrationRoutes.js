const express = require("express")
const router = express.Router()

const {
    registerForSport,
    getMyRegistrations
} = require("../controllers/registrationController")

const { protect } = require("../middleware/authMiddleware")

// Both routes require standard user authentication
router.post("/", protect, registerForSport)
router.get("/my-registrations", protect, getMyRegistrations)

module.exports = router
