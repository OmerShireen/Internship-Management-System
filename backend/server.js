const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const internRoutes = require("./routes/internRoutes")

const taskRoutes = require("./routes/taskRoutes")

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

app.use("/api/interns", internRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes)

app.get("/",(req,res)=>{
    res.send("Internship Management System API is running...");
});


mongoose
    .connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("MongoDB connected");
    })
    .catch((error)=>{
        console.error("MongoDB connection failed ", error)
    });

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})