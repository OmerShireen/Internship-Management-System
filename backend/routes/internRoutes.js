const express = require("express")

const {
  createIntern,
  getAllInterns,
  getInternById,
  updateIntern,
  deactivateIntern,
} = require("../controllers/internController")

const protect = require("../middleware/authMiddleware")
const admin = require("../middleware/adminMiddleware")

const router = express.Router()

// Admin can create an intern
router.post("/", protect, admin, createIntern)

// Admin can view all interns
router.get("/", protect, admin, getAllInterns)

// Authenticated user can view an intern
router.get("/:id", protect, getInternById)

// Authenticated user can update an intern
router.put("/:id", protect, updateIntern)

// Authenticated user can deactivate an intern
router.patch("/:id/status", protect, deactivateIntern)

module.exports = router