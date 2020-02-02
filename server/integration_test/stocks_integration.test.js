process.env.NODE_ENV = "integration";

const { setup, teardown } = require("../test_helpers/in_memory_mongodb_server");
const { signupAsMockUser, loginAsMockUser } = require("../test_helpers");
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

describe("Stock Controller", () => {
  let stockId;

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
    await signupAsMockUser(mockUser);
  });

  test("Able to add stock when logged in", async () => {
    const agent = request.agent(app);
    await loginAsMockUser(agent, mockUser);
    const response = await agent.post("/stocks").send(mockStock);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
  });

  test("Cannot add stock when required fields are missing", async () => {
    const agent = request.agent(app);
    await loginAsMockUser(agent, mockUser);
    const response = await agent.post("/stocks").send({ name: "GOOGLE" });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Stock validation failed");
  });

  test("Able to get stock when logged in", async () => {
    const agent = request.agent(app);
    await loginAsMockUser(agent, mockUser);
    const response = await agent.get("/stocks");
    stockId = response.body.stocks[0]._id;
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

  test("Able to edit stock price", async () => {
    const agent = request.agent(app);
    await loginAsMockUser(agent, mockUser);
    const newTargetLow = 200;
    const response = await agent
      .put(`/stocks/${stockId}`)
      .send({ targetlow: newTargetLow });

    expect(response.status).toBe(200);
    expect(response.body.stock).toEqual(
      expect.objectContaining({
        name: mockStock.name,
        symbol: mockStock.symbol,
        targethigh: mockStock.targethigh,
        targetlow: newTargetLow
      })
    );
  });

  test("Able to delete stock", async () => {
    const agent = request.agent(app);
    await loginAsMockUser(agent, mockUser);
    const response = await agent.delete(`/stocks/${stockId}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
  });
});
