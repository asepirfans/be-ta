const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  suhu: {
    type: Number,
    required: false,
  },
  kelembapan: {
    type: Number,
    required: false,
  },
  kelembapanTanah: {
    type: Number,
    required: false,
  },
  keterangan: {
    type: String,
  },
});

const sensorDataSchema = new mongoose.Schema({
  plant1: {
    type: plantSchema,
    required: false,
  },
  plant2: {
    type: plantSchema,
    required: false,
  },
  plant3: {
    type: plantSchema,
    required: false,
  },
  waktu: {
    type: Date,
    default: Date.now,
  },
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

module.exports = SensorData;
