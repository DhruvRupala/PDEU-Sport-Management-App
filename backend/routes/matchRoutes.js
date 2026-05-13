const express = require("express")
const router = express.Router()

const {
    createMatch,
    getMatchesBySport,
    updateMatchStatus,
    deleteMatch
} = require("../controllers/matchController")

const { protect } = require("../middleware/authMiddleware")

// Public
router.get("/:sportId", getMatchesBySport)

// Protected
router.post("/", protect, createMatch)
router.patch("/:id/status", protect, updateMatchStatus)
router.delete("/:id", protect, deleteMatch)

module.exports = router