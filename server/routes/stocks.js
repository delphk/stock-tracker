const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const Stock = require("../models/stock");

//Gets stocks saved by user
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userid = req.user._id;
    const stocks = await Stock.find({ userid });
    res.json(stocks);
  }
);

// Handle add new stock
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // const { name, symbol, targetlow, targethigh } = req.body;
    const newStock = new Stock(req.body);
    newStock.userid = req.user._id;
    await newStock.save();
    res.json({ status: "success" });
  }
);

// Handle delete stock
router.delete("/:id", async (req, res) => {
  const stock = await Stock.findByIdAndDelete(req.params.id);
  res.json({ status: "success" });
});

// Handle edit stock
router.put("/:id", async (req, res) => {
  const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json({ stock });
});

// router.use((err, req, res, next) => {
//   // If err has no error code, set error code to 500
//   if (!err.statusCode) {
//     err.statusCode = 500;
//     err.message = { message: "Internal server error" };
//   }

//   // send back specified status code and message
//   res.status(err.statusCode).json({ message: err.message });
// });

module.exports = router;
