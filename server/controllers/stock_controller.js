const iex = require("../api/iex");
const Stock = require("../models/stock");
const { cache, getUrlFromRequest } = require("../middlewares/cache");

const getSymbol = async (req, res) => {
  try {
    const response = await iex.get(
      `/${req.params.id}/quote?token=${process.env.IEX_API_KEY}`
    );
    res.json(response.data);
  } catch (err) {
    if (err.response.status === 404) res.json({ message: "stock not found" });
    else res.status(500);
  }
};

const getStockPrices = async (req, res) => {
  try {
    const { range } = req.query;
    let URL = `/market/batch?symbols=${req.params.id}&token=${
      process.env.IEX_API_KEY
    }&types=quote`;
    if (range) {
      URL = URL + `,chart&range=${range}`;
    }
    const response = await iex.get(URL);
    if (range) {
      const url = getUrlFromRequest(req);
      cache.set(url, response.data);
    }
    res.json(response.data);
  } catch (err) {
    res.status(500);
  }
};

const getStocks = async (req, res) => {
  try {
    const userid = req.user._id;
    const stocks = await Stock.find({ userid });
    res.json({ stocks });
  } catch (err) {
    console.log(err);
  }
};

const addStock = async (req, res) => {
  try {
    const newStock = new Stock(req.body);
    newStock.userid = req.user._id;
    await newStock.save();
    res.status(201).json({ status: "success" });
  } catch (err) {
    res.status(400).json(err);
  }
};

const deleteStock = async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.json({ status: "success" });
  } catch (err) {
    console.log(err);
  }
};

const editStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json({ stock });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getSymbol,
  getStockPrices,
  getStocks,
  addStock,
  deleteStock,
  editStock
};
