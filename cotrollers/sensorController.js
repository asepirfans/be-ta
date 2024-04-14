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
    res.status(500).json({ error: err.message });
  }
}

// const getHighestSensor = async (req, res) => {
//   try {
//     const dataSensor = await SensorData.find().sort({ waktu: -1 }).lean();
    
//     if (!dataSensor) {
//       return res.status(404).json({ message: 'Data tidak ditemukan' });
//     }

//     // Ambil semua nilai suhu dari dataSensor
//     const allTemperatures1 = dataSensor
//       .flatMap(sensor => [sensor.plant1?.suhu, sensor.plant2?.suhu, sensor.plant3?.suhu])
//       .filter(suhu => suhu !== undefined);

//     // Cari suhu tertinggi
//     const highestTemperature1 = Math.max(...allTemperatures1);

//     const allTemperatures2 = dataSensor
//       .flatMap(sensor => [sensor.plant2?.suhu])
//       .filter(suhu => suhu !== undefined);

//     // Cari suhu tertinggi
//     const highestTemperature2 = Math.max(...allTemperatures2);

//     const allTemperatures3 = dataSensor
//       .flatMap(sensor => [sensor.plant3?.suhu])
//       .filter(suhu => suhu !== undefined);

//     // Cari suhu tertinggi
//     const highestTemperature3 = Math.max(...allTemperatures3);

//     const allSoil1 = dataSensor
//     .flatMap(sensor => [sensor.plant1?.kelembapanTanah])
//     .filter(kelembapanTanah => kelembapanTanah !== undefined);

//   // Cari suhu tertinggi
//     const highestSoil1 = Math.max(...allSoil1);

//     const allSoil2 = dataSensor
//     .flatMap(sensor => [sensor.plant2?.kelembapanTanah])
//     .filter(kelembapanTanah => kelembapanTanah !== undefined);

//   // Cari suhu tertinggi
//     const highestSoil2 = Math.max(...allSoil2);

//     const allSoil3 = dataSensor
//     .flatMap(sensor => [sensor.plant3?.kelembapanTanah])
//     .filter(kelembapanTanah => kelembapanTanah !== undefined);

//   // Cari suhu tertinggi
//     const highestSoil3 = Math.max(...allSoil3);

//     res.status(200).json({
//       success: true,
//       statusCode: res.statusCode,
//       data: 
//         {
//           plant1: {
//             highestTemperature: highestTemperature1.toPrecision(2),
//             highestSoil: highestSoil1.toPrecision(3),

//           },
//           plant2: {
//             highestTemperature: highestTemperature2.toPrecision(2),
//             highestSoil: highestSoil2.toPrecision(3),

//           },
//           plant3: {
//             highestTemperature: highestTemperature3.toPrecision(2),
//             highestSoil: highestSoil3.toPrecision(3),

//           },
//         }
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

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




module.exports = { createSensor, getSensors, getSensor, getHighestSensor };
