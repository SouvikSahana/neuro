const express= require("express")
const dailyFoodController= require("../controller/dailyFood.controller")
const authenticate= require("../authenticate")
const multer=require("multer")
const upload=multer({

})

const router= express.Router()

router.post("/upload",[authenticate,upload.array("img")],dailyFoodController.createDailyFood)
router.get("/all",authenticate,dailyFoodController.getDailyFoods)
router.get("/id/:id",authenticate,dailyFoodController.getSpecificDailyFood)
router.post("/update/:id",[authenticate,upload.array("img")],dailyFoodController.updateDailyFood)
router.post("/delete",authenticate,dailyFoodController.deleteDailyFood)

module.exports= router