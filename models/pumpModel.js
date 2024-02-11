const mongoose = require('mongoose');

const pumpSchema = new mongoose.Schema({
  pump1: {
    type: String,
  },
  pump2: {
    type: String, 
  },
  pump3: {
    type: String, 
  },
  waktu: {
    type: Date,
    default: Date.now,
  },
});

const PumpData = mongoose.model('PumpData', pumpSchema);

module.exports = PumpData;