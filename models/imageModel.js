const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new mongoose.Schema({
    // data: Buffer,
    contentType: String,
    image: Buffer, // Path atau URL gambar
    label: String, // Label hasil deteksi
    treatment: String,
    waktu: {
        type: Date,
        default: Date.now,
      },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  });

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;