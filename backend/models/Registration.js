const mongoose = require("mongoose")

const registrationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    sport_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sport",
        required: true
    },
    team_name: {
        type: String
    },
    players: [{
        name: String,
        roll_no: String,
        phone: String
    }],
    payment_status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },
    transaction_id: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Registration", registrationSchema)
