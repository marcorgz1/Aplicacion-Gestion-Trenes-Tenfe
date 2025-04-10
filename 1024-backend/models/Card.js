const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CardSchema = new Schema ({
    cardNumber: { type: String, required: true },
    cvv: { type: String, required: true },
    expirationDate: { type: Date },
    balance: { type: Number},
    cardName: { type: String},
});

module.exports = mongoose.model('Card' , CardSchema);