const Stock = require("../models/stock");

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
    const stock = await Stock.findByIdAndDelete(req.params.id);
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
  getStocks,
  addStock,
  deleteStock,
  editStock
};
