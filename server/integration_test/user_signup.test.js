process.env.NODE_ENV = "integration";

const { setup, teardown } = require("../test_helpers/in_memory_mongodb_server");
const request = require("supertest");
const app = require("../app");
const User = require("../models/user");

beforeAll(setup);
afterAll(teardown);

describe("New user signup", () => {
  it("should register a user successfully", async () => {
    const username = "emily";
    const name = "emily";
    const email = "emily@email.com";
    const password = "emily123";

    const response = await request(app)
      .post("/users/register")
      .send({ username, name, email, password });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user: { username, email } });
  });
});
