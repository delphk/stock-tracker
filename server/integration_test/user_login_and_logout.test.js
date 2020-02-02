process.env.NODE_ENV = "integration";

const { setup, teardown } = require("../test_helpers/in_memory_mongodb_server");
const { signupAsMockUser, loginAsMockUser } = require("../test_helpers");
const request = require("supertest");
const app = require("../app");

beforeAll(setup);
afterAll(teardown);

let mockUser = {
  username: "ashley",
  name: "ashley",
  email: "ashley@email.com",
  password: "ashley123"
};

describe("User authentication", () => {
  it("should authenticate user", async () => {
    await signupAsMockUser(mockUser);
    const { username, password, email } = mockUser;
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

  it("should not authenticate user with invalid password", async () => {
    const { username } = mockUser;
    let response = await request(app)
      .post("/users/login")
      .send({ username, password: "boguspassword" });

    expect(response.status).toBe(403);
    expect(response.body.error.message).toEqual(
      "Username and/or password is invalid"
    );
  });

  it("should not authenticate user with invalid username", async () => {
    let response = await request(app)
      .post("/users/login")
      .send({ username: "bogus", password: "boguspassword" });

    expect(response.status).toBe(403);
    expect(response.body.error.message).toEqual(
      "Username and/or password is invalid"
    );
  });
});

describe("User logout", () => {
  it("logout should clear cookie storing the jwt", async () => {
    beforeEach(async () => await signupAsMockUser(mockUser));

    const agent = request.agent(app);
    await loginAsMockUser(agent, mockUser);
    let response = await agent.post("/users/logout");
    expect(response.status).toEqual(200);
  });
});
