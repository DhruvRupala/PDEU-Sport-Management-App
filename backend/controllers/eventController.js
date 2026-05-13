const Event = require("../models/Event")

// GET all events
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 })
        res.json(events)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// CREATE event
const createEvent = async (req, res) => {
    try {
        const { event_name, event_type, start_date, end_date, description } = req.body
        const newEvent = await Event.create({
            event_name,
            event_type,
            start_date,
            end_date,
            description
        })
        res.status(201).json(newEvent)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// UPDATE event status
const updateEventStatus = async (req, res) => {
    try {
        const { status } = req.body

        const event = await Event.findById(req.params.id)

        if (!event) {
            return res.status(404).json({ message: "Event not found" })
        }

        event.status = status
        await event.save()

        res.json(event)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// UPDATE full event details
const updateEvent = async (req, res) => {
    try {
        const { event_name, event_type, start_date, end_date, description } = req.body

        const event = await Event.findById(req.params.id)

        if (!event) {
            return res.status(404).json({ message: "Event not found" })
        }

        event.event_name = event_name || event.event_name
        event.event_type = event_type || event.event_type
        event.start_date = start_date || event.start_date
        event.end_date = end_date || event.end_date
        event.description = description || event.description

        await event.save()

        res.json(event)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEventStatus,
    updateEvent
}