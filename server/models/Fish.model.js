const { Schema, model } = require("mongoose");

const FishSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  display_name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    required: true
  },
  shadow: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  price_cj: {
    type: Number,
    required: true
  },
  image_uri: {
    type: String,
    required: true
  },
  icon_uri: {
    type: String,
    required: true
  },
  month_array_northern: {
    type: Array,
    required: true
  },
  month_array_southern: {
    type: Array,
    required: true
  },
  time_array: {
    type: Array,
    required: true
  }
});

const Fish = model("Fish", FishSchema);

module.exports = Fish;