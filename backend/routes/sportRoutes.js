const express = require("express")
const router = express.Router()

const {
    createSport,
    getSportsByEvent,
    deleteSport
} = require("../controllers/sportController")

const { protect, managerOrAdmin } = require("../middleware/authMiddleware")

// Public
router.get("/:eventId", getSportsByEvent)

// Protected (Manager/ADMIN ONLY)
router.post("/", protect, managerOrAdmin, createSport)
router.delete("/:id", protect, managerOrAdmin, deleteSport)

module.exports = router

