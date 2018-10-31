const express = require("express");
const router = require("express-promise-router")();

const Stock = require("../models/stock");

//Gets stocks saved by user
router.get("/:userid", async (req, res) => {
  const stocks = await Stock.find({ userid: req.params.userid });
  res.json(stocks);
});

// Handle add new stock
router.post("/", async (req, res) => {
  // const { name, symbol, targetlow, targethigh } = req.body;
  const newStock = new Stock(req.body);
  await newStock.save();
  res.json({ status: "success" });
});

// Handle delete stock
router.delete("/:id", async (req, res) => {
  const stock = await Stock.findByIdAndDelete(req.params.id);
  res.json({ status: "success" });
});

// Handle edit stock
router.put("/:id", async (req, res) => {
  const stock = await Stock.findByIdAndUpdate(req.params.id, req.body);
  res.json({ status: "success" });
});

module.exports = router;
