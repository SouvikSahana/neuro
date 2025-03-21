const express=require("express")
const prescriptionController= require("../controller/prescription.controller")
const authenticate=require("../authenticate")

const router= express.Router()

router.get("/id/:prescriptionId",authenticate,prescriptionController.getSpecificPrescription)
router.get("/all",authenticate,prescriptionController.getPrescriptions)
router.get("/dm/all",authenticate,prescriptionController.getDistinctMedicines)
router.post("/update",authenticate,prescriptionController.updatePrescription)
router.get("/delete/:id",authenticate,prescriptionController.deletePrescription)
router.get("/deleteimg/:id",authenticate,prescriptionController.deletePrescriptionAndImage)

module.exports = router