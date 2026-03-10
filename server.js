const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const dotenv = require("dotenv")

dotenv.config()

const apiRoutes = require("./routes/api")

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/clasico_store"

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(__dirname))
app.use("/api", apiRoutes)

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", database: mongoose.connection.readyState === 1 })
})

app.get("*", (req, res) => {
  const safePath = path.join(__dirname, req.path)
  res.sendFile(safePath, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, "index.html"))
    }
  })
})

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected")
    app.listen(PORT, () => {
      console.log(`CLASICO server running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message)
    app.listen(PORT, () => {
      console.log(
        `CLASICO server running without database on http://localhost:${PORT}`
      )
    })
  })
