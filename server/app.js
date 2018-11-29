if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}
const { passport } = require("./passport");
const alert = require("./cron-alert");
const express = require("express"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  cookieParser = require("cookie-parser"),
  cors = require("cors"),
  path = require("path");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cookieParser());

app.use(morgan("dev"));
const staticFiles = express.static(path.join(__dirname, "../client/build"));

if (process.env.NODE_ENV === "production") {
  app.use(staticFiles);
}

// Routes
const userRouter = require("./routes/users");
const stockRouter = require("./routes/stocks");
app.use("/users", userRouter);
app.use("/stocks", stockRouter);

if (process.env.NODE_ENV === "production") {
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

//Scheduled tasks
alert.start();

module.exports = app;
