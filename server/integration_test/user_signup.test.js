process.env.NODE_ENV = "integration";

const { setup, teardown } = require("../test_helpers/in_memory_mongodb_server");
const request = require("supertest");
const app = require("../app");
const User = require("../models/user");

beforeAll(setup);
afterAll(teardown);

let mockUser = {
  username: "emily",
  name: "emily",
  email: "emily@email.com",
  password: "emily123"
};

describe("New user signup", () => {
  it("should register a user successfully", async () => {
    const { username, name, email, password } = mockUser;

    const response = await request(app)
      .post("/users/register")
      .send({ username, name, email, password });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user: { username, email } });
  });

  it("should not register user if username already exists", async () => {
    const { username, name, password } = mockUser;
    const email = "emily2@email.com";

    const response = await request(app)
      .post("/users/register")
      .send({ username, name, email, password });

    expect(response.body).toEqual({
      message: "User validation failed: username: has been taken"
    });
  });

  it("should not register user if email already exists", async () => {
    const { email, name, password } = mockUser;
    const username = "emily2";

    const response = await request(app)
      .post("/users/register")
      .send({ username, name, email, password });

    expect(response.body).toEqual({
      message: "User validation failed: email: has been taken"
    });
  });

  it("should not register user if fields are missing", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        username: "emily3",
        email: "emily3@email.com",
        password: "emily"
      });

    expect(response.body).toEqual({
      message: "User validation failed: name: is required"
    });
  });
});
