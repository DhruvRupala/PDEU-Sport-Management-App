const Match = require("../models/Match")

// CREATE match
const createMatch = async (req, res) => {
    try {
        const { sport_id, team1, team2, match_date, venue } = req.body

        const match = await Match.create({
            sport_id,
            team1,
            team2,
            match_date,
            venue
        })

        res.status(201).json(match)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// GET matches by sport
const getMatchesBySport = async (req, res) => {
    try {
        const matches = await Match.find({ sport_id: req.params.sportId })
            .populate("team1", "team_name")
            .populate("team2", "team_name")

        res.json(matches)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// UPDATE match status
const updateMatchStatus = async (req, res) => {
    try {
        const { status } = req.body

        const match = await Match.findById(req.params.id)

        if (!match) {
            return res.status(404).json({ message: "Match not found" })
        }

        match.status = status
        await match.save()

        res.json(match)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// DELETE match
const deleteMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id)

        if (!match) {
            return res.status(404).json({ message: "Match not found" })
        }

        await match.deleteOne()

        res.json({ message: "Match deleted" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    createMatch,
    getMatchesBySport,
    updateMatchStatus,
    deleteMatch
}