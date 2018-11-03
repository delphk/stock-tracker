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

  it("can be searched by id", async () => {
    const searchResult = await User.findOne({ _id: user._id });
    expect(searchResult.username).toEqual(user.username);
    expect(searchResult.email).toEqual(user.email);
  });

  it("can be searched by username", async () => {
    const searchResult = await User.findOne({ username: user.username });
    expect(searchResult.username).toEqual(user.username);
    expect(searchResult.email).toEqual(user.email);
  });

  it("can be searched by email", async () => {
    const searchResult = await User.findOne({ email: user.email });
    expect(searchResult.username).toEqual(user.username);
    expect(searchResult.email).toEqual(user.email);
  });

  it("can delete user", async () => {
    await user.remove();
    const searchResult = await User.findById(user._id);
    expect(searchResult).toBeNull();
  });
});

describe("unique fields in user model", () => {
  const username = "jason";
  const email = "jason@email.com";
  const name = "jason";

  const user = new User({ username, email, name });

  beforeEach(async () => await user.save());

  it("should not allow two of the same username to be saved", async () => {
    const email2 = "jason2@email.com";
    const user2 = new User({ username, name, email2 });
    await expect(user2.save()).rejects.toThrow("username: has been taken");
  });

  it("should not allow two of the same email to be saved", async () => {
    const username2 = "jason2";
    const user2 = new User({ username: username2, name, email });
    await expect(user2.save()).rejects.toThrow("email: has been taken");
  });
});

describe("certain fields in user model should be case insensitive", () => {
  const username = "sharon";
  const email = "sharon@email.com";
  const name = "sharon";
  const user = new User({ username, email, name });

  const username2 = "sharon2";
  const email2 = "sharon@email.com";

  beforeEach(async () => await user.save());

  it("username should be case insensitive", async () => {
    const user2 = new User({
      username: username.toUpperCase(),
      email: email2,
      name
    });
    await expect(user2.save()).rejects.toThrow("username: has been taken");
  });

  it("email should be case insensitive", async () => {
    const user2 = new User({
      username: username2,
      email: email.toUpperCase(),
      name
    });
    await expect(user2.save()).rejects.toThrow("email: has been taken");
  });
});

describe("some fields are mandatory", () => {
  const username = "jay";
  const name = "jay";
  const email = "jay@email.com";

  it("username field is mandatory", async () => {
    const user = new User({ email, name });
    await expect(user.save()).rejects.toThrow("username: is required");
  });

  it("email field is mandatory", async () => {
    const user = new User({ username, name });
    await expect(user.save()).rejects.toThrow("email: is required");
  });

  it("name field is mandatory", async () => {
    const user = new User({ username, email });
    await expect(user.save()).rejects.toThrow("name: is required");
  });
});

describe("only saves valid email", () => {
  it("invalid email address throws error", async () => {
    const user = new User({ username: "ella", email: "ella", name: "ella" });
    await expect(user.save()).rejects.toThrow("email: invalid email");
  });

  it("valid email address throws error", async () => {
    const user = new User({
      username: "ella",
      email: "ella@email.com",
      name: "ella"
    });
    await expect(user.save()).resolves;
  });
});

describe("setting and validation of password", () => {
  const username = "eric";
  const email = "eric@email.com";
  const password = "eric123";

  const user = new User({ username, email, name });
  beforeEach(async () => await user.save());

  it("should hash passwords", async () => {
    expect(user.salt).toBeUndefined();
    expect(user.hash).toBeUndefined();

    user.setPassword(password);
    expect(user.salt).toBeDefined();
    expect(user.salt).not.toBeNull();
    expect(user.hash).toBeDefined();
    expect(user.hash).not.toBeNull();
  });

  it("should be able to verify passwords", () => {
    expect(user.verifyPassword(password)).toBeTruthy();
  });
});

describe("JWT tokens", () => {
  const user = new User({
    username: "ben",
    email: "ben@email.com",
    name: "ben"
  });

  beforeEach(async () => {
    await user.save();
  });

  it("should generate and verify JWT tokens", () => {
    const token = user.generateToken();
    expect(user.verifyToken(token)).toBeTruthy();
  });

  it("should not verify invalid JWT tokens", () => {
    expect(user.verifyToken("invalid")).toBeFalsy();
  });
});
