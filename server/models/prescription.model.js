const mongoose= require("mongoose")

const prescriptionSchema= new mongoose.Schema({
    image:{
        type:String,
        unique: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    doctor:{
        type:String
    },
    doctorMobile:{
        type:Number
    },
    date:{
        type:Date
    },
    processedAt:{
        type: Date,
        default: Date.now()
    },
    regnNo:{
        type:Number
    },
    degrees:[String],
    diseases:[String],
    medicines:[String],
    remark:{type:String}
})

const Prescription= mongoose.model("prescriptions",prescriptionSchema)

module.exports= Prescription