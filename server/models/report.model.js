const mongoose= require("mongoose")

const reportSchema= new mongoose.Schema({
    image:{
        type:String,
        unique: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    refBy:{
        type:String
    },

    processedAt:{
        type: Date,
        default: Date.now()
    },
    date:{
        type:Date
    },
    labName:{
        type:String,
    },
    labAddress:{
        type: String
    },
    labMobile:{
        type:Number
    },
    labEmail:{
        type: String
    },
    values:[
        {testName:String,
            testValue:Number,
            testUnit:String,
            testMethod:String
        }
    ],
    remark:{
        type: String
    }
})

const Report= mongoose.model("reports",reportSchema)
module.exports = Report