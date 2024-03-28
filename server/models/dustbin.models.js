const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const DustbinSchema = new Schema({
  dustbinID: {
    type: String,
    required: true,
    unique: true,
    maxlength: 6
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  zone: {
    type: String,
    required: true
  }
});

const Dustbin = mongoose.model('Dustbin', DustbinSchema);
module.exports = {Dustbin};
