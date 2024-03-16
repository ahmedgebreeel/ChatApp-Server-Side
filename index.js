//#region for import
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
const { connect } = require("./db");
const userRouter = require("./Routes/userRoute.js")
const chatRouter = require("./Routes/chatRoute.js")
const messageRouter = require("./Routes/messageRouter.js")
const cookieParser = require('cookie-parser');
const AppError = require("./utils/appError.js");
// #endregion

const app = express()



app.use(express.json());
app.use(cookieParser());

app.use(cors());
//#region for routes
app.use("/user", userRouter)
app.use("/chat", chatRouter)
app.use("/message", messageRouter)

app.get("/", (req, res) => {
  res.send("Welcome to our Chat App...")
})
// #endregion
//#region for error handle
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
// #endregion

const port = process.env.PORT || 5000


connect()

app.listen(port, (req, res) => {
  console.log(`Server running on port.... ${port}`)
})