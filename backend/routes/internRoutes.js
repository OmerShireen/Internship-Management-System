const express = require("express");
const {getAllInterns, getInternById, updateIntern, deactivateIntern} = require("../controllers/internController");
const protect = require("../middleware/authMiddleware")
const router = express.Router();

router.get("/", protect, getAllInterns); 
router.get("/:id", protect, getInternById); 
router.put("/:id", protect, updateIntern); 
router.patch("/:id/status", protect, deactivateIntern); 

module.exports = router;