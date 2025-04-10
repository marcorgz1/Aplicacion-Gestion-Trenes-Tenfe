const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ticketSchema = new Schema({
  train: { type: Schema.ObjectId, ref: 'train' },
  user: { type: Schema.ObjectId, ref: 'user' },
  passengers: [{ type: Schema.ObjectId, ref: 'passenger' }],
  seats: [{ type: Number, required: true }],
  locator: { type: String, required: true }
})

module.exports = mongoose.model('Ticket', ticketSchema)