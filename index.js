// index.js
const express = require("express")
const mongoose = require("mongoose")
const app = express()
const dotenv = require("dotenv")
const userRoutes = require("./routes/userRoutes")
const cors = require("cors")

const corsOptions = {
  origin: "https://make-user-react.vercel.app", // Allow only this origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}

// Set headers for credentials
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Credentials", "true")
//   next()
// })

//static assets in the public
// app.use(express.static("public"))

app.options("", cors(corsOptions))
app.use(cors(corsOptions))

// app.use(cors())

// Load environment variables
dotenv.config()

// Middleware to parse JSON
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1) // Exit process with failure
  })

// Use user routes
app.use("/api", userRoutes)

// Basic route
app.get("/", (req, res) => {
  res.send("Hello World!")
})

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
