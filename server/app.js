var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var dotenv = require("dotenv");
var mongoose = require("mongoose");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

import { isAuth as authMiddleware } from "./utils/middlewares";
import mailRouter from "./routes/mail";

dotenv.config({ path: path.resolve(__dirname, ".env") });

mongoose
  .connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("~~~~~ Connected to Database");
  })
  .catch(err => console.error("~~~~~ Error in Database connection", err));

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use(authMiddleware);
app.use("/", indexRouter);

app.use("/api/mail/", mailRouter);

module.exports = app;
