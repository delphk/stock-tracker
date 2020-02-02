const request = require("supertest");
const app = require("../app");

const signupAsMockUser = async user => {
  const response = await request(app)
    .post("/users/register")
    .send(user);

  expect(response.status).toBe(200);
};

const loginAsMockUser = async (agent, user) => {
  const response = await agent
    .post("/users/login")
    .send({ username: user.username, password: user.password });
  expect(response.status).toBe(200);
};

module.exports = { signupAsMockUser, loginAsMockUser };
