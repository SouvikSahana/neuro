const express= require("express")
const {extractData}=require("../controller/process.controller")
const authenticate = require("../authenticate")
const router= express.Router()

router.get("/:image",authenticate,extractData)

module.exports= router