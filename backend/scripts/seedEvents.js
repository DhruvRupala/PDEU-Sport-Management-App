const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Event = require("../models/Event")
const connectDB = require("../config/db")

dotenv.config()
connectDB()

const seedEvents = async () => {
    try {
        const events = [
            { event_name: "Energy cup", event_type: "inter-university", status: "open soon" },
            { event_name: "Intra Cup", event_type: "intra-university", status: "registration open" },
            { event_name: "Freshers cup", event_type: "freshers", status: "open soon" }
        ]

        for (let evt of events) {
            const existing = await Event.findOne({ event_name: evt.event_name })
            if (!existing) {
                await Event.create(evt)
                console.log(`Created event: ${evt.event_name}`)
            } else {
                // Update status if it's currently invalid from older schema versions
                if (!["open soon", "registration open", "ongoing", "closed"].includes(existing.status)) {
                   existing.status = "open soon"
                   await existing.save()
                }
                console.log(`Event ${evt.event_name} already exists.`)
            }
        }
        
        console.log("Seeding complete.")
        process.exit()

    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

seedEvents()
