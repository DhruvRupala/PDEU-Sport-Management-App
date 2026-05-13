const mongoose = require("mongoose")

const resultSchema = new mongoose.Schema({
    match_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Match",
        required:true
    },

    winner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Team",
        required:true
    },

    score:{
        type:String,
        required:true
    }

},{
    timestamps:true
})

module.exports = mongoose.model("Result", resultSchema)