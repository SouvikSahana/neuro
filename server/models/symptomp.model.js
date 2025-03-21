const mongoose= require("mongoose")

const symptompSchema= new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    images:[String],
    symps:[String],
    time:{
        type:Date,
        default: Date.now()
    }
})

const Symptomp= mongoose.model("symptomps",symptompSchema)

module.exports= Symptomp