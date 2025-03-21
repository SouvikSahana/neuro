const mongoose= require("mongoose")

const dailyFoodSchema= new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    images:[String],
    items:[String],
    time:{
        type:Date,
        default: Date.now()
    }
})

const DailyFood= mongoose.model("dailyFoods",dailyFoodSchema)

module.exports= DailyFood