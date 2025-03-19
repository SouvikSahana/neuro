const mongoose=require("mongoose")

const billSchema= new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    image:{
        type: String,
        unique: true
    },
    date:{
        type:Date,
    },
    processedAt:{
        type: Date,
        default: Date.now()
    },
    shop:{
        type: String
    },
    shopAddress:{
        type:String
    },
    medicines:[{name:String, amount:Number}],
    amount:{
        type:Number
    },
    finalAmount:{
        type:Number
    },
    shopMobile:{
        type:Number
    },
    shopEmail:{
        type:String
    },
    remark:{type:String}
})

const Bill= mongoose.model("bills",billSchema)

module.exports= Bill