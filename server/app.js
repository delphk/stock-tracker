if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}
const { passport } = require("./passport");
const express = require("express"),
  bodyParser = require("body-parser"),
  morgan = require("morgan");
cookieParser = require("cookie-parser");
path = require("path");

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(passport.initialize());

const staticFiles = express.static(path.join(__dirname, "../client/build"));

if (process.env.NODE_ENV === "production") {
  app.use(staticFiles);
}

// Routes
const userRouter = require("./routes/users");
const stockRouter = require("./routes/stocks");
app.use("/users", userRouter);
app.use("/stocks", stockRouter);

module.exports = app;
