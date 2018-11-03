process.env.NODE_ENV = "integration";

const { setup, teardown } = require("../test_helpers/in_memory_mongodb_server");
const request = require("supertest");
const app = require("../app");
const User = require("../models/user");

beforeAll(setup);
afterAll(teardown);

let users;

async function createFakeUsers() {
  let user = new User({
    username: "ashley",
    email: "ashley@email.com",
    name: "ashley"
  });
  const password = "ashley123";
  user.password = password;
  user.setPassword(password);
  const savedUser = await user.save();

  users = { user: savedUser };
}

async function loginAsAshley(password, agent) {
  const username = users.user.username;
  let response = await agent.post("/users/login").send({ username, password });
  expect(response.status).toEqual(200);
}

describe("User authentication", () => {
  beforeEach(async () => await createFakeUsers());

  it("should authenticate user", async () => {
    const { username, password, email } = users.user;
    let response = await request(app)
      .post("/users/login")
      .send({ username, password });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({ user: { username, email } });
    const jwtTokenCookie = [expect.stringMatching(/jwt/)];
    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining(jwtTokenCookie)
    );
  });
});

describe("User logout", () => {
  it("logout should clear cookie storing the jwt", async () => {
    beforeEach(async () => await createFakeUsers());
    const agent = request.agent(app);
    await loginAsAshley(users.user.password, agent);
    let response = await agent.post("/users/logout");
    expect(response.status).toEqual(200);
  });
});
