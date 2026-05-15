const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")

dotenv.config()
connectDB()

const app = express()

// ─── CORS Configuration ─────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true)
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true
}))
app.use(express.json())

// ─── Routes ─────────────────────────────────────────────────────
app.use("/api/auth",    require("./routes/authRoutes"))
app.use("/api/events",  require("./routes/eventRoutes"))
app.use("/api/sports",  require("./routes/sportRoutes"))
app.use("/api/teams",   require("./routes/teamRoutes"))
app.use("/api/matches", require("./routes/matchRoutes"))
app.use("/api/results", require("./routes/resultRoutes"))
app.use("/api/admin", require("./routes/adminRoutes"))
app.use("/api/registrations", require("./routes/registrationRoutes"))
app.get("/", (req, res) => res.send("API Running"))

// ─── Start ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))