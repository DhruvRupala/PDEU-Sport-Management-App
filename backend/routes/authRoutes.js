const express = require("express")
const router = express.Router()

const { registerUser, loginUser } = require("../controllers/authController")
const { protect } = require("../middleware/authMiddleware")

// Public
router.post("/register", registerUser)
router.post("/login", loginUser)

// Protected — get own profile
router.get("/me", protect, (req, res) => {
  res.json(req.user)
})

module.exports = router