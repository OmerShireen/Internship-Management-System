const express = require("express");

const { getMyProgress } = require("../controllers/progressController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/my", protect, getMyProgress);

module.exports = router;