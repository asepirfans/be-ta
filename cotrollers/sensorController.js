const SensorData = require('../models/sensorModel');

const createSensor = async (req, res) => {
  try {
    const { plant1, plant2, plant3 } = req.body;

    plant1.keterangan = plant1.kelembapanTanah < 60 ? 'Pompa Nyala' : 'Pompa Mati';
    plant2.keterangan = plant2.kelembapanTanah < 60 ? 'Pompa Nyala' : 'Pompa Mati';
    plant3.keterangan = plant3.kelembapanTanah < 60 ? 'Pompa Nyala' : 'Pompa Mati';

    const newSensorData = {
      plant1,
      plant2,
      plant3,
      waktu: Date.now(),
    };

    await SensorData.create(newSensorData);

    res.status(201).json({
      success: true,
      statusCode: res.statusCode,
      message: "Data sensor berhasil dibuat",
      data: newSensorData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      statusCode: res.statusCode,
      error: err.message,
    });
  }
};

const getSensors = async (req, res) => {
  try {
    const dataSensor = await SensorData.find();
    if (!dataSensor) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    res.status(200).json(
      {
        success: true,
        statusCode: res.statusCode,
        data: dataSensor,
      }
      );
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createSensor, getSensors };
