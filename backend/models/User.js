const mongoose = reqiure("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password:{
            type: String,
            required: true
        },

        role:{
            type: String,
            enum:["admin","intern"],
            default: "intern"
        },

        university:{
            type: String,
            trim: true
        },

        department:{
            type: String,
            trim: true
        },
        startDate: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = Users;