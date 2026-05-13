const express = require("express")
const router = express.Router()

const {
    getEvents,
    createEvent,
    updateEventStatus
} = require("../controllers/eventController")

const { protect, managerOrAdmin } = require("../middleware/authMiddleware")

router.get("/", getEvents)

// protected routes
router.post("/", protect, managerOrAdmin, createEvent)
router.patch("/:id/status", protect, managerOrAdmin, updateEventStatus)

module.exports = router

