const mongoose = require("mongoose");
const { Schema } = mongoose;

const stockSchema = new Schema({
  symbol: {
    type: String,
    required: [true, "is required"]
  },
  name: {
    type: String
  },
  userid: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "is required"]
  },
  targetlow: Number,
  targethigh: Number
});

stockSchema.index({ symbol: -1, userid: 1 }, { unique: true });

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
