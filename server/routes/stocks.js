const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  getStocks,
  addStock,
  deleteStock,
  editStock
} = require("../controllers/stock_controller");

//Gets stocks saved by user
router.get("/", passport.authenticate("jwt", { session: false }), getStocks);

// Handle add new stock
router.post("/", passport.authenticate("jwt", { session: false }), addStock);

// Handle delete stock
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteStock
);

// Handle edit stock
router.put("/:id", passport.authenticate("jwt", { session: false }), editStock);

module.exports = router;
