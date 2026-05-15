const Registration = require("../models/Registration")
const Match = require("../models/Match")
const Team = require("../models/Team")
const Result = require("../models/Result")
const Event = require("../models/Event")
const User = require("../models/User")

// @desc    Register a user for a specific sport in an event
// @route   POST /api/registrations
// @access  Private
const registerForSport = async (req, res) => {
    try {
        const { event_id, sport_id, transaction_id, team_name, players } = req.body
        const user_id = req.user.id // Requires auth middleware

        // Check if already registered
        const existing = await Registration.findOne({ user_id, event_id, sport_id })
        if (existing) {
            return res.status(400).json({ message: "You are already registered for this sport." })
        }

        const registration = new Registration({
            user_id,
            event_id,
            sport_id,
            team_name,
            players,
            payment_status: "pending",
            transaction_id: transaction_id || "PENDING_" + Math.floor(Math.random() * 1000000)
        })

        await registration.save()
        res.status(201).json(registration)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get user's own registrations
// @route   GET /api/registrations/my-registrations
// @access  Private
const getMyRegistrations = async (req, res) => {
    try {
        const user_id = req.user.id
        const registrations = await Registration.find({ user_id })
            .populate("event_id", "event_name status")
            .populate("sport_id", "sport_name type")

        res.json(registrations)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get full participation dashboard data
// @route   GET /api/registrations/dashboard
// @access  Private
const getParticipationStats = async (req, res) => {
    try {
        const user = req.user

        // ── Registrations ──
        const registrations = await Registration.find({ user_id: user._id })
            .populate("event_id", "event_name event_type status start_date end_date description")
            .populate("sport_id", "sport_name type team_size rules")
            .sort({ createdAt: -1 })

        const total = registrations.length
        const completed = registrations.filter(r => r.payment_status === "completed").length
        const pending = registrations.filter(r => r.payment_status === "pending").length
        const failed = registrations.filter(r => r.payment_status === "failed").length

        // ── Unique event + sport IDs from user registrations ──
        const sportIds = [...new Set(registrations.map(r => r.sport_id?._id?.toString()).filter(Boolean))]

        // ── Upcoming matches for user's sports ──
        let upcomingMatches = []
        if (sportIds.length > 0) {
            upcomingMatches = await Match.find({
                sport_id: { $in: sportIds },
                status: { $in: ["scheduled", "ongoing"] }
            })
                .populate("sport_id", "sport_name type")
                .populate("team1", "team_name")
                .populate("team2", "team_name")
                .sort({ match_date: 1 })
                .limit(20)
        }

        // ── Teams user is part of ──
        let userTeams = []
        const teamNames = registrations.map(r => r.team_name).filter(Boolean)
        if (teamNames.length > 0) {
            userTeams = await Team.find({ team_name: { $in: teamNames } })
                .populate("sport_id", "sport_name type team_size")
        }

        // ── Leaderboard: wins per university ──
        const allResults = await Result.find()
            .populate({
                path: "winner",
                select: "team_name university_id",
                populate: { path: "university_id", select: "name" }
            })
            .populate({
                path: "match_id",
                select: "sport_id",
                populate: { path: "sport_id", select: "sport_name" }
            })

        const uniWins = {}
        allResults.forEach(r => {
            const uniName = r.winner?.university_id?.name || r.winner?.team_name || "Unknown"
            if (!uniWins[uniName]) uniWins[uniName] = { wins: 0, university: uniName }
            uniWins[uniName].wins++
        })

        const leaderboard = Object.values(uniWins)
            .sort((a, b) => b.wins - a.wins)
            .slice(0, 15)

        // ── Active events count ──
        const activeEvents = await Event.countDocuments({ status: { $in: ["registration open", "ongoing"] } })

        // ── Notifications (generated from real data) ──
        const notifications = []

        // Payment reminders
        registrations.filter(r => r.payment_status === "pending").forEach(r => {
            notifications.push({
                _id: `pay_${r._id}`,
                type: "payment",
                title: "Payment Pending",
                message: `Complete payment for ${r.sport_id?.sport_name || "sport"} in ${r.event_id?.event_name || "event"}`,
                time: r.createdAt,
                read: false,
                icon: "fa-credit-card",
                color: "#ed8936"
            })
        })

        // Event status updates
        registrations.forEach(r => {
            if (r.event_id?.status === "ongoing") {
                notifications.push({
                    _id: `event_${r._id}`,
                    type: "event",
                    title: "Event In Progress",
                    message: `${r.event_id?.event_name} is currently ongoing!`,
                    time: new Date(),
                    read: false,
                    icon: "fa-trophy",
                    color: "#6366f1"
                })
            }
        })

        // Upcoming match alerts
        upcomingMatches.slice(0, 3).forEach(m => {
            notifications.push({
                _id: `match_${m._id}`,
                type: "match",
                title: "Upcoming Match",
                message: `${m.team1?.team_name || "TBD"} vs ${m.team2?.team_name || "TBD"} — ${m.sport_id?.sport_name || ""}`,
                time: m.match_date,
                read: false,
                icon: "fa-calendar-days",
                color: "#14b8a6"
            })
        })

        // Welcome / general announcement
        notifications.push({
            _id: "welcome",
            type: "announcement",
            title: "Welcome to PDEU Energy Cup",
            message: "Stay updated with your events, matches and results from your personalized dashboard.",
            time: user.createdAt,
            read: true,
            icon: "fa-bullhorn",
            color: "#a6192e"
        })

        notifications.sort((a, b) => new Date(b.time) - new Date(a.time))

        res.json({
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                roll_no: user.roll_no,
                university_name: user.university_name,
                role: user.role,
                status: user.status,
                createdAt: user.createdAt
            },
            stats: { total, completed, pending, failed, activeEvents },
            registrations,
            upcomingMatches,
            userTeams,
            leaderboard,
            notifications
        })
    } catch (error) {
        console.error("Dashboard error:", error)
        res.status(500).json({ message: error.message })
    }
}

// @desc    Update user profile
// @route   PATCH /api/registrations/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { name, phone, gender } = req.body
        const user = await User.findById(req.user._id)

        if (!user) return res.status(404).json({ message: "User not found" })

        if (name) user.name = name
        if (phone) user.phone = phone
        if (gender) user.gender = gender

        await user.save()

        res.json({
            name: user.name,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
            roll_no: user.roll_no,
            university_name: user.university_name,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    registerForSport,
    getMyRegistrations,
    getParticipationStats,
    updateProfile
}
