const Registration = require("../models/Registration")

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

module.exports = {
    registerForSport,
    getMyRegistrations
}
