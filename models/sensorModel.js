const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  suhu: {
    type: Number,
    required: true,
  },
  kelembapan: {
    type: Number,
    required: true,
  },
  kelembapanTanah: {
    type: Number,
    required: true,
  },
  keterangan: {
    type: String,
  },
});

const sensorDataSchema = new mongoose.Schema({
  plant1: {
    type: plantSchema,
    required: true,
  },
  plant2: {
    type: plantSchema,
    required: true,
  },
  plant3: {
    type: plantSchema,
    required: true,
  },
  waktu: {
    type: Date,
    default: Date.now,
  },
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

module.exports = SensorData;
