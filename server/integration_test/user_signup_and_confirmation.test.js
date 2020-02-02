process.env.NODE_ENV = "integration";

const { setup, teardown } = require("../test_helpers/in_memory_mongodb_server");
const request = require("supertest");
const app = require("../app");
const User = require("../models/user");
const Token = require("../models/token");

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

describe("user confirmation routes", () => {
  it("should not verify if token is invalid", async () => {
    const fakeToken = "123456faketoken";
    let response = await request(app).get(`/users/confirmation/${fakeToken}`);
    expect(response.status).toEqual(400);
    expect(response.body.msg).toEqual(
      "We were unable to find a valid token. Your token may have expired."
    );
  });

  it("should verify user if token is valid", async () => {
    const user = await User.findOne({ username: mockUser.username });
    const tokenString = "validToken123456";
    const token = new Token({
      userId: user._id,
      token: tokenString
    });
    await token.save();

    let response = await request(app).get(`/users/confirmation/${tokenString}`);
    expect(response.status).toEqual(200);
    expect(response.text).toEqual(
      "Your account has been verified. Please log in."
    );
  });

  it("should not verify if user is invalid", async () => {
    const user = await User.findOne({ username: mockUser.username });

    const tokenString = "anotherValidToken123456";
    const token = new Token({
      userId: user._id,
      token: tokenString
    });
    await token.save();

    await User.findByIdAndDelete(user._id);

    let response = await request(app).get(`/users/confirmation/${tokenString}`);
    expect(response.status).toEqual(400);
    expect(response.body.msg).toEqual(
      "We were unable to find a user for this token."
    );
  });
});
