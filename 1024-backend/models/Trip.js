const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO De primeras puede que no necesitemos este modelo. Valorar eliminar
const tripSchema = new Schema({
  owner: { type: Schema.ObjectId, ref: "user" },
  train: { type: Schema.ObjectId, ref: "train" },
  seats: [Number],
});

module.exports = mongoose.model("Trip", tripSchema);
