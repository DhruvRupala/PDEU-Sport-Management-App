const jwt = require("jsonwebtoken")
const User = require("../models/User")

// ─── protect: any logged-in user ────────────────────────────────
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, access denied" })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach full user to request (excluding password)
    req.user = await User.findById(decoded.id).select("-password")

    if (!req.user) {
      return res.status(401).json({ message: "User not found" })
    }

    next()
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" })
  }
}

// ─── adminOnly: must be admin ────────────────────────────────────
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" })
  }
  next()
}

// ─── managerOrAdmin: manager or admin ───────────────────────────
const managerOrAdmin = (req, res, next) => {
  if (!["manager", "admin"].includes(req.user?.role)) {
    return res.status(403).json({ message: "Manager or Admin access only" })
  }
  next()
}

module.exports = { protect, adminOnly, managerOrAdmin }