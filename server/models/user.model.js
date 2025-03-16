const mongoose= require("mongoose")

const userSchema= new  mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type: String,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    birth:{
        type: Date,
    },
    image:{
        type: String
    },
    address:[
        {
            value:{
                type:String
            },
            addressType:{
                type: String
            }
        }
    ],
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

const User= mongoose.model("users",userSchema)

module.exports= User