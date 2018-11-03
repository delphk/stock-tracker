const { setup, teardown } = require("../test_helpers/in_memory_mongodb_server");
const Stock = require("./stock");

beforeAll(setup);
afterAll(teardown);

describe("Stock model", () => {
  const symbol = "FB";
  const name = "Facebook Inc";
  const userid = "5bdbf439b050847e7f87c448";
  const stock = new Stock({ symbol, name, userid });
  beforeEach(async () => await stock.save());

  it("should be able to save new stock", async () => {
    const stock2 = new Stock({ symbol, name, userid });
    await expect(stock2.save()).resolves.toBe(stock2);
  });

  it("can be searched by id", async () => {
    const searchResult = await Stock.findOne({ _id: stock._id });
    expect(searchResult.symbol).toEqual(stock.symbol);
    expect(searchResult.name).toEqual(stock.name);
  });

  it("can be searched by user id", async () => {
    const searchResult = await Stock.find({ userid: stock.userid });
    expect(searchResult).toHaveLength(2);
  });

  it("can edit stock", async () => {
    const editedStock = await Stock.findOneAndUpdate(
      { _id: stock._id },
      { targetlow: 5 },
      { new: true }
    );
    expect(editedStock.targetlow).toEqual(5);
  });

  it("can delete stock", async () => {
    await stock.remove();
    const searchResult = await Stock.findById(stock._id);
    expect(searchResult).toBeNull();
  });
});

describe("some fields are mandatory", () => {
  const symbol = "FB";
  const name = "Facebook Inc";
  const userid = "5bdbf439b050847e7f87c448";

  it("symbol field is mandatory", async () => {
    const stock = new Stock({ name, userid, targetlow: 5 });
    await expect(stock.save()).rejects.toThrow("symbol: is required");
  });

  it("userid is mandatory", async () => {
    const stock = new Stock({ name, symbol, targethigh: 5 });
    await expect(stock.save()).rejects.toThrow("userid: is required");
  });
});
