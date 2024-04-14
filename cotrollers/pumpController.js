const PumpData = require('../models/pumpModel');

const postPump = async (req, res) => {
  try {
    const { pump1, pump2, pump3 } = req.body;
    const pumpData =  await PumpData.create({ pump1, pump2, pump3 });

    res.status(201).json({
      success: true,
      statusCode: res.statusCode,
      message: "Data pompa berhasil dibuat",
      data: pumpData,
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

const getPump = async (req, res) => {
    try {
      const dataPump = await PumpData.find().sort({waktu:-1}).limit(1);
      if (!dataPump) {
        return res.status(404).json({ message: 'Data tidak ditemukan' });
      }
      const { pump1, pump2, pump3 } = dataPump[0];
      res.status(200).json(
        {
          success: true,
          statusCode: res.statusCode,
          data: { pump1, pump2, pump3 }
        }
        );
    } catch (error) {
      res.status(500).json({ error: err.message });
    }
  }

module.exports = { postPump, getPump };