const express= require("express")
const router= express.Router()

const authController= require("../controller/auth.controller")
const authenticate=require("../authenticate")

router.post("/otp",authController.generateOtp)
router.post("/login",authController.login)
router.post("/register",authController.register)
router.post("/password",authController.changePassword)
router.post("/updateuser",authenticate,authController.updateUser)
router.post("/deleteuser",authenticate,authController.deleteUser)

router.get("/profile",authenticate,authController.getProfile)

module.exports= router