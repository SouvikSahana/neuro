const express=require("express")
const reportController= require("../controller/report.controller")
const authenticate=require("../authenticate")

const router= express.Router()

router.get("/id/:reportId",authenticate,reportController.getSpecificReport)
router.get("/all",authenticate,reportController.getReports)

router.post("/update",authenticate,reportController.updateReport)
router.get("/delete/:id",authenticate,reportController.deleteReport)
router.get("/deleteimg/:id",authenticate,reportController.deleteReportAndImage)

module.exports = router