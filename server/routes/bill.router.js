const express=require("express")
const billController= require("../controller/bill.controller")
const authenticate=require("../authenticate")

const router= express.Router()

router.get("/id/:billId",authenticate,billController.getSpecificBill)
router.get("/all",authenticate,billController.getBills)


router.post("/update",authenticate,billController.updateBill)
router.get("/delete/:id",authenticate,billController.deleteBill)
router.get("/deleteimg/:id",authenticate,billController.deleteBillAndImage)

module.exports = router