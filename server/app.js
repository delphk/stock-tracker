if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}
const { passport } = require("./passport");
const express = require("express"),
  bodyParser = require("body-parser"),
  morgan = require("morgan");
cookieParser = require("cookie-parser");

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(passport.initialize());

// if (process.env.NODE_ENV === "development") {
//   app.use(errorhandler());
// }

// Routes
const userRouter = require("./routes/users");
const stockRouter = require("./routes/stocks");
app.use("/users", userRouter);
app.use("/stocks", stockRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   let err = new Error("Not Found");
//   err.status = status.NOT_FOUND;
//   next(err);
// });

// // default error handler

// if (!isProduction) {
//   // eslint-disable-next-line no-unused-vars
//   app.use(function(err, req, res, next) {
//     // return more information for trouble shooting if we are not running in production
//     if (err.stack) {
//       logger.error(err.stack);
//     }

//     res.status(err.status || status.INTERNAL_SERVER_ERROR);

//     res.json({
//       error: {
//         message: err.message
//       }
//     });
//   });
// }

// // eslint-disable-next-line no-unused-vars
// app.use(function(err, req, res, next) {
//   res.status(err.status || status.INTERNAL_SERVER_ERROR);
//   res.json({
//     error: {
//       message: err.message
//     }
//   });
// });

module.exports = app;
