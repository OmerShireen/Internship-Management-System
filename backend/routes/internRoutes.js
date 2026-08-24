const express = require("express");
const {getAllInterns, getInternById, updateIntern, deactivateIntern} = require("../controllers/internController");

const protect = require("../middleware/authMiddleware")
const admin = require("../middleware/adminMiddleware")

const router = express.Router();

router.get("/", protect, admin,  getAllInterns); 
router.get("/:id", protect, getInternById); 
router.put("/:id", protect, updateIntern); 
router.patch("/:id/status", protect, deactivateIntern); 

module.exports = router;