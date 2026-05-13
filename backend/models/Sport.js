const mongoose = require("mongoose")

const sportSchema = new mongoose.Schema({
    sport_name:{
        type:String,
        required:true
    },

    event_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event",
        required:true
    },

    type:{
        type:String,
        enum:["team","individual"],
        required:true
    },

    team_size:{
        type:Number
    },

    rules: {
        max_participants_per_uni: { type: Number },
        substitutes_allowed: { type: Number }
    }

},{
    timestamps:true
})

module.exports = mongoose.model("Sport", sportSchema)