const express = require("express");

const {
    createTask,
    getAllTasks,
    getMyTasks,
    updateTaskStatus,
    deleteTask
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware")
const router = express.Router();

router.post("/", protect, admin, createTask);

router.get("/", protect, admin, getAllTasks);

router.get("/my", protect, getMyTasks);

router.patch("/:id/status", protect, updateTaskStatus);

router.delete("/:id", protect, admin, deleteTask);

module.exports = router;