const { setup, teardown } = require("../test_helpers/in_memory_mongodb_server");
const User = require("./user");

beforeAll(setup);
afterAll(teardown);
