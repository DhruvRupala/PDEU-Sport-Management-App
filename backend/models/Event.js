const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    event_name:{
        type:String,
        required:true
    },
    event_type:{
        type:String,
        enum:["freshers","intra-university","inter-university"],
        required:true
    },
    status:{
        type:String,
        enum:["open soon","registration open","ongoing","closed"],
        default:"open soon"
    },
    start_date:Date,
    end_date:Date,
    description:String
},{
    timestamps:true
})

module.exports = mongoose.model("Event", eventSchema)