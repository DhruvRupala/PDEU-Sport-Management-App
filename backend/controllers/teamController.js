const Team = require("../models/Team")

// CREATE team
const createTeam = async (req, res) => {
    try {
        const { team_name, sport_id, university_id } = req.body

        const team = await Team.create({
            team_name,
            sport_id,
            university_id
        })

        res.status(201).json(team)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// GET teams by sport
const getTeamsBySport = async (req, res) => {
    try {
        const teams = await Team.find({ sport_id: req.params.sportId })
            .populate("university_id", "university_name")

        res.json(teams)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// DELETE team
const deleteTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)

        if (!team) {
            return res.status(404).json({ message: "Team not found" })
        }

        await team.deleteOne()

        res.json({ message: "Team deleted" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    createTeam,
    getTeamsBySport,
    deleteTeam
}