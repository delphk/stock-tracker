const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3001;

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true }
);
const db = mongoose.connection;

db.once("open", () => {
  console.log("Database is connected");
});

db.on("error", error => {
  console.log("An error occurred", error);
});

app.set("port", process.env.PORT || 3001);
app.listen(app.get("port"), () => {
  console.log(`Listening on port ${app.get("port")}`);
});
