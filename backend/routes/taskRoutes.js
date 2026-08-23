const express = require("express");

const {
    createTask,
    getAllTasks,
    getMyTasks,
    updateTaskStatus
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createTask);

router.get("/", protect, getAllTasks);

router.get("/my", protect, getMyTasks);

router.patch("/:id/status", protect, updateTaskStatus);

module.exports = router;