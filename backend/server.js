const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Internship Management System API is running...");
});

mongoose
    .connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("MongoDB connected");
    })
    .catch((error)=>{
        console.error("MongoDB connection failed, error")
    });

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})