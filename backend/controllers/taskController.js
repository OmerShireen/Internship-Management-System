const Task = require("../models/Task");
const User = require("../models/User");
 
// Create a new task
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            assignedTo,
            deadline
        } = req.body;

        if (!title || !description || !assignedTo || !deadline) {
            return res.status(400).json({
                message: "Title, description, assignedTo and deadline are required"
            });
        }

        const intern = await User.findOne({
            _id: assignedTo,
            role: "intern"
        });

        if (!intern) {
            return res.status(404).json({
                message: "Intern not found"
            });
        }

        const task = await Task.create({
            title,
            description,
            assignedTo,
            deadline
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get all tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("assignedTo", "name email university department");

        res.status(200).json({
            count: tasks.length,
            tasks
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get tasks assigned to logged-in intern
const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            assignedTo: req.user.userId
        });

        res.status(200).json({
            count: tasks.length,
            tasks
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Update task status
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                message: "Status is required"
            });
        }

        const allowedStatuses = [
            "pending",
            "in-progress",
            "completed"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }
        if(task.assignedTo.toString() !== req.user.userId){
            return res.status(403).json({
                message: "You can only update your own tasks"
            });
        }

        task.status = status;

        await task.save();

        res.status(200).json({
            message: "Task status updated successfully",
            task
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteTask = async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);

        if(!task){
            return res.status(404).json({
                message: "Task not found"
            });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        })
    }
}


module.exports = {
    createTask,
    getAllTasks,
    getMyTasks,
    updateTaskStatus,
    deleteTask 
};