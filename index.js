const express = require("express")
const mongoose = require("mongoose")
const app = express()
const dotenv = require("dotenv")
const bcrypt = require("bcrypt")
const cors = require("cors")

dotenv.config()
app.use(express.json())
app.use(cors())

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

// Models
const User = require("./models/User")
const { createUserResponseDTO } = require("./models/createUserResponseDTO")

// Routes
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, password } = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" })
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    })

    const savedUser = await newUser.save()
    const userDto = createUserResponseDTO(savedUser)
    res.status(201).json(userDto)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find()
    const userDtos = users.map((user) => createUserResponseDTO(user))
    res.json(userDtos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ msg: "User not found" })
    const userDto = createUserResponseDTO(user)
    res.json(userDto)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put("/api/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!updatedUser) return res.status(404).json({ msg: "User not found" })
    const userDto = createUserResponseDTO(updatedUser)
    res.status(201).json(userDto)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete("/api/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    if (!deletedUser) return res.status(404).json({ msg: "User not found" })
    res.json({ msg: "User deleted" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Basic route
app.get("/", (req, res) => {
  res.send("Hello World!")
})

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = app
