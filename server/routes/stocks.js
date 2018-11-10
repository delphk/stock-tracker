const express = require("express");
const router = express.Router();
const passport = require("passport");
const Stock = require("../models/stock");

//Gets stocks saved by user
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userid = req.user._id;
      const stocks = await Stock.find({ userid });
      res.json({ stocks });
    } catch (err) {
      console.log(err);
    }
  }
);

// Handle add new stock
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const newStock = new Stock(req.body);
      newStock.userid = req.user._id;
      await newStock.save();
      res.status(201).json({ status: "success" });
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

// Handle delete stock
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const stock = await Stock.findByIdAndDelete(req.params.id);
      res.json({ status: "success" });
    } catch (err) {
      console.log(err);
    }
  }
);

// Handle edit stock
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      });
      res.json({ stock });
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = router;
