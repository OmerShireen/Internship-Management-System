const express = require("express");

const {
    submitTaskWork,
    getMySubmissions,
    getAllSubmissions,
    reviewSubmission
} = require("../controllers/submissionController");

const protect = require("../middleware/authMiddleware");

const admin = require("../middleware/adminMiddleware")
const router = express.Router();

router.post("/", protect, submitTaskWork);

router.get("/",protect, admin, getAllSubmissions);

router.get("/my", protect, getMySubmissions);

router.patch("/:id/review", protect, admin, reviewSubmission)

module.exports = router;