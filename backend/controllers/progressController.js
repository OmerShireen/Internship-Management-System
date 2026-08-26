const Task = require("../models/Task");
const User = require("../models/User");

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

const getAllInternProgress = async (req, res) => {
    try{
        const interns = await User.find({
            role: "intern"
        }).select("name email university department status");

        const progressData = await Promise.all(
            interns.map(async(intern)=>{

                const tasks = await Task.find({
                    assignedTo: intern._id
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
                        : Math.round(
                            (completedTasks / totalTasks) * 100
                        );
                
                return {
                    intern: {
                        id: intern._id,
                        name: intern.name,
                        email: intern.email,
                        university: intern.university,
                        department: intern.department,
                        status: intern.status
                    },
                    totalTasks,
                    completedTasks,
                    pendingTasks,
                    inProgressTasks,
                    progress: `${progress}%`

                };         
            })
        );

        res.status(200).json({
            count : progressData.length,
            interns: progressData
        });


    } catch (error){
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getMyProgress,
    getAllInternProgress  
};