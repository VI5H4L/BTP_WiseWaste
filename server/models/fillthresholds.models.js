const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const FillThresholdsSchema = new Schema({
  id: {
    type: Number,
  },
  dustbinFillThreshold: {
    type: Number,
    min: 0,
    max: 100
  },
  zoneFillThreshold: {
    type: Number,
    min: 0,
    max: 100
  }
});

const FillThresholds = mongoose.model('FillThresholds', FillThresholdsSchema);
module.exports = {FillThresholds};
