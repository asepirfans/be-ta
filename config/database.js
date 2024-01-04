const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Berhasil terkoneksi ke MongoDB');
  } catch (error) {
    console.error('Gagal terkoneksi ke MongoDB:', error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
