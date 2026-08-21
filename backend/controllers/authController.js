const User = require("../models/User");
const bcrypt = require("bcryptjs");

const registerUser = async(req, res)=>{
    try{
        const{
            name,
            email,
            password,
            role,
            university,
            department 
        } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                message: "Name , email and password are required"
            });
        }
        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.status(400).json({
                message: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name, 
            email,
            password: hashedPassword,
            role: role || "intern",
            university, 
            department
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                university: user.university,
                department: user.department
            }
        });
    }
    catch(error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    registerUser
};