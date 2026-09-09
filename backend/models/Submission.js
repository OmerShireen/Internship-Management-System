const mongoose = require("mongoose")

const submissionSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    intern: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    submissionLink: {
      type: String,
      required: true,
      trim: true,
    },

    comments: {
      type: String,
      trim: true,
    },

    feedback: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  "Submission",
  submissionSchema
)