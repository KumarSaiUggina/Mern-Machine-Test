const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  sequenceValue: {
    type: Number,
    default: 10000, // Starting value for the unique ID
  },
});

const Counter = new mongoose.model("counter", counterSchema);

module.exports = Counter;
