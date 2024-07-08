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

const getAllSensors = async (req, res) => {
  try {
    const dataSensor = (await SensorData.find().sort({waktu:1})).reverse();
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
    res.status(500).json({ error: error.message });
  }
}

const getSensors = async (req, res) => {
  try {
    const dataSensor = (await SensorData.find().sort({waktu:-1}).limit(5)).reverse();
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

const getSensorByKet = async (req, res) => {
  try {
    const dataSensor = await SensorData.aggregate([
      {
        $match: {
          $or: [
            { "plant1.keterangan": "Pompa Nyala" },
            { "plant2.keterangan": "Pompa Nyala" },
            { "plant3.keterangan": "Pompa Nyala" }
          ]
        }
      },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          plant1: "$plant1.keterangan",
          plant2: "$plant2.keterangan",
          plant3: "$plant3.keterangan",
          waktu: 1
        }
      }
    ]).exec();

    if (!dataSensor || dataSensor.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    // Format the response data
    const formattedData = dataSensor.map(item => ({
      plant1: item.plant1 || "Pompa Nyala",
      plant2: item.plant2 || "Pompa Nyala",
      plant3: item.plant3 || "Pompa Nyala",
      waktu: item.waktu
    }));

    res.status(200).json({
      success: true,
      statusCode: res.statusCode,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSensor = async (req, res) => {
  try {
    const dataSensor = await SensorData.find().sort({waktu:-1}).limit(1);
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
    res.status(500).json({ error: error.message });
  }
}

const getHighestSensor = async (req, res) => {
  try {
    // Mendapatkan waktu saat ini
    const currentTime = new Date();

    // Menghitung waktu 5 menit yang lalu
    const fiveMinutesAgo = new Date(currentTime.getTime() - 5 * 60 * 1000);

    // Mengambil data sensor yang memiliki waktu dalam rentang 5 menit terakhir
    const dataSensor = await SensorData.find({
      waktu: { $gte: fiveMinutesAgo, $lte: currentTime }
    }).sort({ waktu: -1 }).lean();

    res.status(200).json({
      success: true,
      statusCode: res.statusCode,
      data: { dataSensor },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}




module.exports = { createSensor, getSensors, getSensor, getHighestSensor, getSensorByKet, getAllSensors };
