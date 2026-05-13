const express = require("express")
const router = express.Router()

const {
    createTeam,
    getTeamsBySport,
    deleteTeam
} = require("../controllers/teamController")

const { protect } = require("../middleware/authMiddleware")

// Public
router.get("/:sportId", getTeamsBySport)

// Protected
router.post("/", protect, createTeam)
router.delete("/:id", protect, deleteTeam)

module.exports = router