const Submission = require("../models/Submission");
const Task = require("../models/Task");

// Submit task work
const submitTaskWork = async (req, res) => {
    try {
        const { taskId, content } = req.body;

        // Check required fields
        if (!taskId || !content) {
            return res.status(400).json({
                message: "Task ID and content are required"
            });
        }

        // Find the task
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Check that the task belongs to the logged-in intern
        if (task.assignedTo.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You can only submit work for your own tasks"
            });
        }

        // Check if submission already exists
        const existingSubmission = await Submission.findOne({
            task: taskId,
            intern: req.user.userId
        });

        if (existingSubmission) {
            return res.status(400).json({
                message: "You have already submitted this task"
            });
        }

        // Create submission
        const submission = await Submission.create({
            task: taskId,
            intern: req.user.userId,
            content
        });

        res.status(201).json({
            message: "Task submitted successfully",
            submission
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Get submissions of logged-in intern
const getMySubmissions = async (req, res) => {
    try {

        const submissions = await Submission.find({
            intern: req.user.userId
        })
        .populate("task", "title description deadline status");

        res.status(200).json({
            count: submissions.length,
            submissions
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Get all submissions - Admin only
const getAllSubmissions = async (req, res) => {
    try {

        const submissions = await Submission.find()
            .populate("task", "title description deadline")
            .populate("intern", "name email university department");

        res.status(200).json({
            count: submissions.length,
            submissions
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Admin reviews a submission
const reviewSubmission = async (req, res) => {
    try {
        const { status, feedback } = req.body;

        // Check if status is provided
        if (!status) {
            return res.status(400).json({
                message: "Status is required"
            });
        }

        // Only approved or rejected are allowed
        const allowedStatuses = ["approved", "rejected"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Status must be approved or rejected"
            });
        }

        // Find the submission
        const submission = await Submission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({
                message: "Submission not found"
            });
        }

        // Update review information
        submission.status = status;
        submission.feedback = feedback || "";
        submission.reviewedAt = new Date();
        submission.reviewedBy = req.user.userId;

        await submission.save();

        res.status(200).json({
            message: "Submission reviewed successfully",
            submission
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    submitTaskWork,
    getMySubmissions,
    getAllSubmissions,
    reviewSubmission
};