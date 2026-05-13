const mongoose = require("mongoose")

const matchSchema = new mongoose.Schema({
    sport_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Sport",
        required:true
    },

    team1:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Team",
        required:true
    },

    team2:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Team",
        required:true
    },

    match_date:{
        type:Date,
        required:true
    },

    venue:{
        type:String
    },

    status:{
        type:String,
        enum:["scheduled","ongoing","completed"],
        default:"scheduled"
    }

},{
    timestamps:true
})

module.exports = mongoose.model("Match", matchSchema)