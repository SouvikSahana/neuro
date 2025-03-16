const express=require("express")
const cors= require("cors")
const {connectDb}=require("./db")

const app=express()
app.use(cors("*"))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.get("/",(req,res)=>{
    res.send({message:"This is a Web Server of Neruo"})
})

const authRouter= require("./routes/auth.router")
app.use("/auth",authRouter)

const imageRouter= require("./routes/image.router")
app.use("/media",imageRouter)

const port= process.env.PORT || 5000
app.listen(port,()=>{
    console.log("Server is running...")
})