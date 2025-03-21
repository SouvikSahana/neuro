const express= require("express")
const symptompController= require("../controller/symptomp.controller")
const authenticate= require("../authenticate")
const multer=require("multer")
const upload=multer({

})

const router= express.Router()

router.post("/upload",[authenticate,upload.array("img")],symptompController.createSymptomp)
router.get("/all",authenticate,symptompController.getSymptomps)
router.get("/ds/all",authenticate,symptompController.getDistinctSymptomps)
router.get("/id/:id",authenticate,symptompController.getSpecificSymptomp)
router.post("/update/:id",[authenticate,upload.array("img")],symptompController.updateSymptomp)
router.post("/delete",authenticate,symptompController.deleteSymptomp)

module.exports= router