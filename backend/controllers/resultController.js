const Result = require("../models/Result")
const Match = require("../models/Match")

// CREATE result
const createResult = async (req, res) => {
    try {
        const { match_id, winner, score } = req.body

        const result = await Result.create({
            match_id,
            winner,
            score
        })

        // Update match status to completed
        await Match.findByIdAndUpdate(match_id, {
            status: "completed"
        })

        res.status(201).json(result)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// GET results by sport
const getResultsBySport = async (req, res) => {
    try {
        const results = await Result.find()
            .populate({
                path: "match_id",
                match: { sport_id: req.params.sportId },
                populate: [
                    { path: "team1", select: "team_name" },
                    { path: "team2", select: "team_name" }
                ]
            })
            .populate("winner", "team_name")

        // filter null matches
        const filtered = results.filter(r => r.match_id !== null)

        res.json(filtered)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// DELETE result
const deleteResult = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id)

        if (!result) {
            return res.status(404).json({ message: "Result not found" })
        }

        await result.deleteOne()

        res.json({ message: "Result deleted" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    createResult,
    getResultsBySport,
    deleteResult
}