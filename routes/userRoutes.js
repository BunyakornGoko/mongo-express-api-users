// routes/userRoutes.js
const express = require("express")
const router = express.Router()
const User = require("../models/Users")
const bcrypt = require("bcrypt")

// Create a new user
router.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Simple validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" })
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword // Note: In production, hash passwords before storing
    })

    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get a single user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ msg: "User not found" })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update a user by ID
router.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!updatedUser) return res.status(404).json({ msg: "User not found" })
    res.json(updatedUser)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete a user by ID
router.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    if (!deletedUser) return res.status(404).json({ msg: "User not found" })
    res.json({ msg: "User deleted" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
