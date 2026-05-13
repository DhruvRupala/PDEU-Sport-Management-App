const Sport = require("../models/Sport")

// CREATE sport
const createSport = async (req, res) => {
    try {
        const { sport_name, event_id, type, team_size, rules } = req.body

        const sport = await Sport.create({
            sport_name,
            event_id,
            type,
            team_size,
            rules: rules || {}
        })

        res.status(201).json(sport)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// GET sports by event
const getSportsByEvent = async (req, res) => {
    try {
        const sports = await Sport.find({ event_id: req.params.eventId }).populate("event_id", "status event_name")

        res.json(sports)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// DELETE sport
const deleteSport = async (req, res) => {
    try {
        const sport = await Sport.findById(req.params.id)

        if (!sport) {
            return res.status(404).json({ message: "Sport not found" })
        }

        await sport.deleteOne()

        res.json({ message: "Sport deleted" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    createSport,
    getSportsByEvent,
    deleteSport
}