const mongoose = require("mongoose")

const universitySchema = new mongoose.Schema({
    university_name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    contact_person:String,
    phone:String

},{
    timestamps:true
})

module.exports = mongoose.model("University", universitySchema)