process.env.NODE_ENV = "integration";

const { setup, teardown } = require("../test_helpers/in_memory_mongodb_server");
const { signupAsMockUser, loginAsMockUser } = require("../test_helpers");
const request = require("supertest");
const app = require("../app");
const User = require("../models/user");

beforeAll(setup);
afterAll(teardown);

let mockUser = {
  username: "bruno",
  name: "bruno",
  email: "bruno@email.com",
  password: "bruno123"
};

beforeAll(async () => {
  await signupAsMockUser(mockUser);
});

describe("user info routes", () => {
  it("gets info of logged in user", async () => {
    const agent = request.agent(app);
    await loginAsMockUser(agent, mockUser);
    let response = await agent.get("/users");
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: mockUser.name,
        username: mockUser.username,
        email: mockUser.email,
        isVerified: false,
        emailAlert: false
      })
    );
  });

  it("updates info of logged in user", async () => {
    const agent = request.agent(app);
    await loginAsMockUser(agent, mockUser);
    let response = await agent
      .put("/users")
      .send({ isVerified: true, emailAlert: true });
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: mockUser.name,
        username: mockUser.username,
        email: mockUser.email,
        isVerified: true,
        emailAlert: true
      })
    );
  });
});

describe("delete user", () => {
  it("should delete valid user", async () => {
    let user = await User.findOne({ username: mockUser.username });
    expect(user).not.toBeNull();

    const agent = request.agent(app);
    await loginAsMockUser(agent, mockUser);
    let response = await agent.delete(`/users/${user._id}`);

    expect(response.status).toEqual(200);
    expect(response.body.status).toEqual("deleted");
    user = await User.findOne({ username: mockUser.username });
    expect(user).toBeNull();
  });
});
