
const User = require("../models/User")
const UniversityCode = require("../models/UniversityCode")
const jwt = require("jsonwebtoken")

// ─── Helper: generate JWT ────────────────────────────────────────
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" })

// ─── Helper: is PDEU email? ──────────────────────────────────────
const isPDEUEmail = (email) =>
  email.endsWith("@pdpu.ac.in") || email.endsWith("@pdeu.ac.in")

// ─── REGISTER (students only) ────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const {
      name, email, password, phone, gender,
      roll_no, university_name, university_code
    } = req.body

    // 1. Basic validation
    if (!name || !email || !password || !phone || !gender || !university_name) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // 2. Block manager/admin self-registration
    if (req.body.role && req.body.role !== "student") {
      return res.status(403).json({ message: "Only student registration is allowed here" })
    }

    // 3. Check duplicate email
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: "Email already registered" })
    }

    let status = "pending"
    let university_code_ref = null

    if (isPDEUEmail(email)) {
      // 4a. PDEU → auto active, no code needed
      status = "active"
    } else {
      // 4b. Non-PDEU → validate university code
      if (!university_code) {
        return res.status(400).json({ message: "University code is required for non-PDEU students" })
      }

      const codeDoc = await UniversityCode.findOne({
        code: university_code,
        is_active: true
      })

      if (!codeDoc) {
        return res.status(400).json({ message: "Invalid or inactive university code" })
      }

      university_code_ref = codeDoc._id
      status = "pending"  // admin approval needed
    }

    // 5. Create student
    const user = await User.create({
      name, email, password, phone, gender,
      roll_no, university_name,
      university_code: university_code || null,
      university_code_ref,
      role: "student",  // always forced to student
      status
    })

    // 6. PDEU → login immediately
    if (status === "active") {
      const token = generateToken(user._id, user.role)
      return res.status(201).json({ token, role: user.role, name: user.name })
    }

    // 7. Non-PDEU → pending
    res.status(201).json({
      message: "Registration submitted. Await admin approval before logging in."
    })

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: err.message })
  }
}

// ─── LOGIN ───────────────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    if (user.status === "pending") {
      return res.status(403).json({ message: "Your account is pending admin approval" })
    }

    if (user.status === "rejected") {
      return res.status(403).json({ message: "Your account has been rejected" })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = generateToken(user._id, user.role)
    res.json({ token, role: user.role, name: user.name })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { registerUser, loginUser }