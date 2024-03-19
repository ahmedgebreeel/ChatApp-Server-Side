const express = require("express");
const cors = require("cors");
const { connect } = require("./db");
const userRouter = require("./routes/userRoute.js")
const chatRouter = require("./routes/chatRoute.js")
const messageRouter = require("./routes/messageRouter.js")
const cookieParser = require('cookie-parser');
const AppError = require("./utils/appError.js");

const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/user", userRouter)
app.use("/chat", chatRouter)
app.use("/message", messageRouter)

app.get("/", (req, res) => {
  res.send("Welcome to our Chat App...")
})

app.all("*", (req, res, next) => {
  next(new AppError(`cant find this route ${req.originalUrl}`, 404))
})
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
})

const port = process.env.PORT || 5000
connect()
app.listen(port, (req, res) => {
  console.log(`Server running on port.... ${port}`)
})