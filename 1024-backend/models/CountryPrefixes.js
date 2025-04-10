const mongoose = require('mongoose');
const Schema = mongoose.Schema

const countryPrefixSchema = new Schema({
  prefix: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("CountryPrefix", countryPrefixSchema);