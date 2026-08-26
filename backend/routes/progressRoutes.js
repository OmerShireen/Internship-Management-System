const express = require("express");

const { getMyProgress, getAllInternProgress } = require("../controllers/progressController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware")

const router = express.Router();

router.get("/my", protect, getMyProgress);

router.get("/all", protect , admin, getAllInternProgress)

module.exports = router;