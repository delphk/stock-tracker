const mongoose = require("mongoose");
const { Schema } = mongoose;

const stockSchema = new Schema({
  symbol: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  userid: { type: Schema.Types.ObjectId, ref: "User", required: true },
  targetlow: Number,
  targethigh: Number
});

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
