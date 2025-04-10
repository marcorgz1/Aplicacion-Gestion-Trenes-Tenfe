const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trainSchema = new Schema({
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureDate: { type: Date, required: true },
  arrivalDate: { type: Date, required: true },
  duration: { type: Number, required: true },
  seats: [{ type: Schema.ObjectId, ref: "trip" }],
  price: { type: Number, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Train", trainSchema);
