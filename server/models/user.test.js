const { setup, teardown } = require("../test_helpers/in_memory_mongodb_server");
const User = require("./user");

beforeAll(setup);
afterAll(teardown);

describe("User model", () => {
  const username = "bruno";
  const email = "bruno@email.com";
  const name = "bruno";

  const user = new User({ username, email, name });

  beforeEach(async () => await user.save());

  it("should be able to save new user", async () => {
    const username2 = "sam";
    const email2 = "sam@email.com";
    const name2 = "sam";

    const user2 = new User({ username: username2, email: email2, name: name2 });
    await expect(user2.save()).resolves.toBe(user2);
  });

  it("can be searched by id", () => {});

  it("can be searched by username", () => {});

  it("can be searched by email", () => {});
});
