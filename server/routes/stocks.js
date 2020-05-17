const express = require("express");
const router = express.Router();
const passport = require("passport");
const { getDataFromCache } = require("../middlewares/cache");

const {
  getSymbol,
  getStockPrices,
  addStock,
  deleteStock,
  editStock
} = require("../controllers/stock_controller");

router.get(
  "/symbol/:id",
  passport.authenticate("jwt", { session: false }),
  getSymbol
);

//Gets prices (current and historical) of stocks saved by user
router.get(
  "/prices",
  passport.authenticate("jwt", { session: false }),
  getDataFromCache,
  getStockPrices
);

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
