const { setup, teardown } = require("../test_helpers/in_memory_mongodb_server");
const Token = require("./token");

beforeAll(setup);
afterAll(teardown);

describe("Token model", () => {
  const userId = "5bdbf439b050847e7f87c448";
  const token = "1234";
  const newToken = new Token({ userId, token });
  beforeEach(async () => await newToken.save());

  it("should be able to save new token", async () => {
    const newToken2 = new Token({ userId, token: "12345" });
    await expect(newToken2.save()).resolves.toBe(newToken2);
  });

  it("should be able to be searched by token number", async () => {
    const searchResult = await Token.findOne({ token });
    expect(searchResult.userId).toEqual(newToken.userId);
  });
});
