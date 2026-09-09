const express = require("express")

const {
  createSubmission,
  getMySubmissions,
  getAllSubmissions,
  reviewSubmission,
} = require("../controllers/submissionController")

const protect = require("../middleware/authMiddleware")
const admin = require("../middleware/adminMiddleware")

const router = express.Router()

router.post(
  "/",
  protect,
  createSubmission
)

router.get(
  "/my",
  protect,
  getMySubmissions
)

router.get(
  "/",
  protect,
  admin,
  getAllSubmissions
)

router.patch(
  "/:id/review",
  protect,
  admin,
  reviewSubmission
)

module.exports = router