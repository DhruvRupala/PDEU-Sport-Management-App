const mongoose = require("mongoose")

const teamSchema = new mongoose.Schema({
    team_name:{
        type:String,
        required:true
    },

    sport_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Sport",
        required:true
    },

    university_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"University"
    }

},{
    timestamps:true
})

module.exports = mongoose.model("Team", teamSchema)