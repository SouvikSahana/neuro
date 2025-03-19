const express=require("express")
const crawlerController= require("../controller/crawler.controller")

const router= express.Router()

router.post("/medicine",crawlerController.crawleMedicine)

module.exports= router