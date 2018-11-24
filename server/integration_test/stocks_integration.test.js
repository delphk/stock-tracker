process.env.NODE_ENV = "integration";

const { setup, teardown } = require("../test_helpers/in_memory_mongodb_server");
const request = require("supertest");
const app = require("../app");

beforeAll(setup);
afterAll(teardown);

let mockUser = {
  username: "betty",
  name: "betty",
  email: "betty@email.com",
  password: "betty123"
};

let mockStock = {
  symbol: "AAPL",
  name: "Apple Inc",
  targetlow: 100,
  targethigh: 300
};

const signupAsMockUser = async () => {
  const response = await request(app)
    .post("/users/register")
    .send(mockUser);

  expect(response.status).toBe(200);
};

const loginAsMockUser = async agent => {
  const response = await agent
    .post("/users/login")
    .send({ username: mockUser.username, password: mockUser.password });
  expect(response.status).toBe(200);
};

describe("Stock Controller", () => {
  test("Cannot add stocks when not logged in", async () => {
    const response = await request(app)
      .post("/stocks")
      .send(mockStock);

    expect(response.status).toBe(401);
  });

  test("Cannot get stocks when not logged in", async () => {
    const response = await request(app).get("/stocks");

    expect(response.status).toBe(401);
  });

  beforeAll(async () => {
    await signupAsMockUser();
  });

  test("Able to add stock when logged in", async () => {
    const agent = request.agent(app);
    await loginAsMockUser(agent);
    const response = await agent.post("/stocks").send(mockStock);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
  });

  test("Able to get stock when logged in", async () => {
    const agent = request.agent(app);
    await loginAsMockUser(agent);
    const response = await agent.get("/stocks");

    expect(response.status).toBe(200);
    expect(response.body.stocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: mockStock.name,
          symbol: mockStock.symbol,
          targethigh: mockStock.targethigh,
          targetlow: mockStock.targetlow
        })
      ])
    );
  });
});
