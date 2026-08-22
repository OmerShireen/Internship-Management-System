const User = require("../models/User");

const getAllInterns = async (req, res) => {
    try {
        const interns = await User.find({ role: "intern" })
            .select("-password");

        res.status(200).json({
            count: interns.length,
            interns
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getInternById = async (req, res) => {
    try {
        const intern = await User.findOne({
            _id: req.params.id,
            role: "intern"
        }).select("-password");

        if (!intern) {
            return res.status(404).json({
                message: "Intern not found"
            });
        }

        res.status(200).json({
            intern
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateIntern = async(req, res)=>{
    try{
        const intern = await User.findOne({
            _id: req.params.id,
            role: "intern"
        });

        if(!intern){
            return res.status(404).json({
                message: "Intern not found"
            });
        }

        const {
            name,
            email,
            university,
            department,
            status
        } = req.body;

        if (name) intern.name = name;
        if (email) intern.email = email;
        if (university) intern.university = university;
        if (department) intern.department = department;
        if (status) intern.status = status;

        await intern.save();

        res.status(200).json({
            message: "Intern updated successfully",
            intern: {
                id: intern._id,
                name: intern.name,
                email: intern.email,
                role: intern.role,
                university: intern.university,
                department: intern.department,
                status: intern.status
            }
        });
    } catch (error){
        console.error(error);

        res.status(500).json({
            message: "Server error"
        })
    }
}

const deactivateIntern = async(req, res ) =>{
    try{
        const intern = await User.findOne({
            _id: req.params.id,
            role: "intern"
        });

        if(!intern){
            res.status(404).json({
                message: "Intern not found"
            });
        }

        intern.status = "inactive";

        await intern.save();

        res.status(200).json({
            message: "Intern deactivated successfully",
            intern:{
                id: intern._id,
                name: intern.name,
                email: intern.email,
                role: intern.role,
                university: intern.university,
                department: intern.department,
                status: intern.status
            }
        });
    } catch (error){
        console.error(error);

        res.status(500).json({
            message: "Server error"
        })
    }
} 
module.exports = {
    getAllInterns,
    getInternById,
    updateIntern,
    deactivateIntern
};