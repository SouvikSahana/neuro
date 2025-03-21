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

const processRouter= require("./routes/process.router")
app.use("/process",processRouter)

const crawlRouter= require("./routes/crawler.router")
app.use("/crawl",crawlRouter)

const reportRouter= require("./routes/report.router")
app.use("/report",reportRouter)

const prescriptionRouter= require("./routes/prescription.router")
app.use("/prescription",prescriptionRouter)

const billRouter= require("./routes/bill.router")
app.use("/bill",billRouter)

const symptompRouter= require("./routes/symptomp.router")
app.use("/symptomp",symptompRouter)

const dailyFoodRouter= require("./routes/dailyFood.router")
app.use("/dailyfood",dailyFoodRouter)

const port= process.env.PORT || 5000
app.listen(port,()=>{
    console.log("Server is running...")
})