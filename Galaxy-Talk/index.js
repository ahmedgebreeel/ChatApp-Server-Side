const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
const { connect } = require("./db");
const userRouter = require("./Routes/userRoute.js")
const cookieParser = require('cookie-parser')

const app = express()



app.use(express.json());
app.use(cookieParser())

app.use(cors());
app.use("/user", userRouter)
app.all("*", (req, res, next) => {
  const err = new Error(`cant find this route ${req.originalUrl}`)
  next(err.message)
})
app.use((err, req, res, next) => {
  res.status(400).json({ err })
})
app.get("/", (req, res) => {
  res.send("Welcome to our Chat App...")
})
const port = process.env.PORT || 5000


connect()

app.listen(port, (req, res) => {
  console.log(`Server running on port.... ${port}`)
})