const express = require("express")
const router = express.Router()

const {
    createResult,
    getResultsBySport,
    deleteResult
} = require("../controllers/resultController")

const { protect } = require("../middleware/authMiddleware")

// Public
router.get("/:sportId", getResultsBySport)

// Protected
router.post("/", protect, createResult)
router.delete("/:id", protect, deleteResult)

module.exports = router