const { sendResponse, AppError } = require("./helpers/utils.js");
require("dotenv").config();
const cors = require("cors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

const mongoose = require("mongoose");
/* DB connection*/
const mongoURI = process.env.MONGODB_URI;
const port = process.env.PORT;
// const mongoURI = "mongodb://localhost:27017/template";

mongoose
  .connect(mongoURI)
  .then(() => console.log(`DB connected ${mongoURI} at port ` + port))
  .catch((err) => console.log(err));

app.use("/", indexRouter);

app.use((req, res, next) => {
  const err = new AppError(404, "Not Found", "Bad Request");
  next(err);
});

app.use((err, req, res, next) => {
  console.log("ERROR", err);
  return sendResponse(
    res,
    err.statusCode ? err.statusCode : 500,
    false,
    null,
    { message: err.message },
    err.isOperational ? err.errorType : "Internal Server Error"
  );
});

module.exports = app;
