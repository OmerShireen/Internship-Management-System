const Task = require("../models/Task");

const getMyProgress = async (req, res) => {
    try {
        const tasks = await Task.find({
            assignedTo: req.user.userId
        });

        const totalTasks = tasks.length;

        const completedTasks = tasks.filter(
            task => task.status === "completed"
        ).length;

        const pendingTasks = tasks.filter(
            task => task.status === "pending"
        ).length;

        const inProgressTasks = tasks.filter(
            task => task.status === "in-progress"
        ).length;

        const progress =
            totalTasks === 0
                ? 0
                : Math.round((completedTasks / totalTasks) * 100);

        res.status(200).json({
            totalTasks,
            completedTasks,
            pendingTasks,
            inProgressTasks,
            progress: `${progress}%`
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getMyProgress
};