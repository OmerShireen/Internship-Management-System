const Submission = require("../models/Submission")
const Task = require("../models/Task")

const createSubmission = async (req, res) => {
  try {
    const {
      task,
      submissionLink,
      comments,
    } = req.body

    if (!task || !submissionLink) {
      return res.status(400).json({
        message: "Task and submission link are required",
      })
    }

    const existingTask = await Task.findById(task)

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      })
    }

    if (existingTask.assignedTo.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only submit your own tasks",
      })
    }

    const existingSubmission = await Submission.findOne({
      task,
      intern: req.user.userId,
    })

    if (existingSubmission) {
      return res.status(400).json({
        message: "You have already submitted this task",
      })
    }

    const submission = await Submission.create({
      task,
      intern: req.user.userId,
      submissionLink,
      comments,
    })

    existingTask.status = "completed"

    await existingTask.save()

    const populatedSubmission = await Submission.findById(
      submission._id
    )
      .populate("task", "title description deadline status")
      .populate("intern", "name email university department")

    res.status(201).json({
      message: "Task submitted successfully",
      submission: populatedSubmission,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      intern: req.user.userId,
    })
      .populate("task", "title description deadline status")
      .populate("intern", "name email university department")

    res.status(200).json({
      count: submissions.length,
      submissions,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("task", "title description deadline")
      .populate("intern", "name email university department")

    res.status(200).json({
      count: submissions.length,
      submissions,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

const reviewSubmission = async (req, res) => {
  try {
    const {
      status,
      feedback,
    } = req.body

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      })
    }

    const allowedStatuses = [
      "approved",
      "rejected",
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid submission status",
      })
    }

    if (status === "rejected" && !feedback) {
      return res.status(400).json({
        message: "Feedback is required when rejecting a submission",
      })
    }

    const submission = await Submission.findById(
      req.params.id
    )

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      })
    }

    submission.status = status
    submission.feedback = feedback || ""

    await submission.save()

    const populatedSubmission = await Submission.findById(
      submission._id
    )
      .populate("task", "title description deadline status")
      .populate("intern", "name email university department")

    res.status(200).json({
      message: "Submission reviewed successfully",
      submission: populatedSubmission,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

module.exports = {
  createSubmission,
  getMySubmissions,
  getAllSubmissions,
  reviewSubmission,
}