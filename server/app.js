if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}
const { passport } = require("./passport");
const express = require("express"),
  path = require("path"),
  bodyParser = require("body-parser"),
  morgan = require("morgan");
cookieParser = require("cookie-parser");

const app = express();

//View Engine
// app.set("views", path.join(__dirname, "views"));
// app.engine("handlebars", exphbs({ defaultLayout: "layout" }));
// app.set("view engine", "handlebars");

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(passport.initialize());

//Connect Flash
// app.use(flash());

//Global Vars
// app.use((req, res, next) => {
//   res.locals.success_msg = req.flash("success_msg");
//   res.locals.error_msg = req.flash("error_msg");
//   res.locals.error = req.flash("error");
//   next();
// });

// if (process.env.NODE_ENV === "development") {
//   app.use(errorhandler());
// }

// Routes
const indexRouter = require("./routes/index");
const userRouter = require("./routes/users");
const stockRouter = require("./routes/stocks");
app.use("/users", userRouter);
app.use("/", indexRouter);
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
