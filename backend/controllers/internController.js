const User = require("../models/User")
const bcrypt = require("bcryptjs")

const getAllInterns = async (req, res) => {
  try {
    const interns = await User.find({ role: "intern" }).select("-password")

    res.status(200).json({
      count: interns.length,
      interns,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

const getInternById = async (req, res) => {
  try {
    const intern = await User.findOne({
      _id: req.params.id,
      role: "intern",
    }).select("-password")

    if (!intern) {
      return res.status(404).json({
        message: "Intern not found",
      })
    }

    res.status(200).json({
      intern,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

const createIntern = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      university,
      department,
    } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const intern = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "intern",
      university,
      department,
    })

    res.status(201).json({
      message: "Intern created successfully",
      intern: {
        id: intern._id,
        name: intern.name,
        email: intern.email,
        role: intern.role,
        university: intern.university,
        department: intern.department,
        status: intern.status,
      },
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

const updateIntern = async (req, res) => {
  try {
    const intern = await User.findOne({
      _id: req.params.id,
      role: "intern",
    })

    if (!intern) {
      return res.status(404).json({
        message: "Intern not found",
      })
    }

    const {
      name,
      email,
      university,
      department,
      status,
    } = req.body

    if (name) intern.name = name
    if (email) intern.email = email
    if (university) intern.university = university
    if (department) intern.department = department
    if (status) intern.status = status

    await intern.save()

    res.status(200).json({
      message: "Intern updated successfully",
      intern: {
        id: intern._id,
        name: intern.name,
        email: intern.email,
        role: intern.role,
        university: intern.university,
        department: intern.department,
        status: intern.status,
      },
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

const deactivateIntern = async (req, res) => {
  try {
    const intern = await User.findOne({
      _id: req.params.id,
      role: "intern",
    })

    if (!intern) {
      return res.status(404).json({
        message: "Intern not found",
      })
    }

    intern.status = "inactive"

    await intern.save()

    res.status(200).json({
      message: "Intern deactivated successfully",
      intern: {
        id: intern._id,
        name: intern.name,
        email: intern.email,
        role: intern.role,
        university: intern.university,
        department: intern.department,
        status: intern.status,
      },
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

module.exports = {
  createIntern,
  getAllInterns,
  getInternById,
  updateIntern,
  deactivateIntern,
}