const mongoose = require("mongoose");
const MongodbMemoryServer = require("mongodb-memory-server").default;

mongoose.Promise = global.Promise;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

let mongoServer;

const setup = async () => {
  mongoServer = new MongodbMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  await mongoose
    .connect(
      mongoUri,
      { useNewUrlParser: true, useCreateIndex: true }
    )
    .then(() => console.log("MongoDB is ready"), err => console.error(err));
};

const teardown = async () => {
  mongoose.disconnect();
  mongoServer.stop();
};

module.exports = { setup, teardown };
