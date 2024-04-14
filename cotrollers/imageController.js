const Image = require('../models/imageModel');
const cloudinary = require('../utils/cloudinary')
const fs = require('fs');

const uploadImage = async (req, res) => {
  const {label, treatment} = req.body;
  const {userId} = req.username;
 try {
  const result  = await cloudinary.uploader.upload(req.file.path);

  const newDetection = new Image({
    imageUrl: result.secure_url,
    label: label,
    treatment: treatment,
    user: userId
  })

  const saveDetection = await newDetection.save();
  res.status(200).json({
    success: true,
    message: "Uploaded!",
    data: saveDetection
  });
 } catch (err) {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Error uploading image"
  });
}
}



// const uploadImage = async (req, res) => {
//       try {
//         // Baca gambar yang diupload
//         const imageBuffer = fs.readFileSync(req.file.path);
//         const contentType = req.file.mimetype;
    
//         // Simpan hasil deteksi ke MongoDB
//         const newDetection = new Image({
//           image: imageBuffer,
//           contentType: contentType,
//           label: req.body.label,
//           treatment: req.body.treatment,
//           waktu: Date.now(),
//           user: req.username.userId,
//         });

//         await newDetection.save();
    
//         // Hapus file yang diupload dari sistem file
//         fs.unlinkSync(req.file.path);
//         res.status(200).json(
//             {
//               success: true,
//               statusCode: res.statusCode,
//               message:"Hasil deteksi berhasil disimpan.",
//               newDetection
//             }
//             );
//       } catch (error) {
//         console.error(error);
//         res.status(500).send('Terjadi kesalahan saat menyimpan hasil deteksi.');
//       }
// }

const getImage = async (req, res) => {
    try {
        // Ambil data gambar dari MongoDB berdasarkan ID
       
        const image = await Image.findById(req.params.id).populate('user', 'username email');
    
        if (image) {
            res.status(200).json({
              success: true,
              statusCode: res.statusCode,
              waktu:image.waktu,
              label: image.label,
              treatment: image.treatment,
              image: image.image.toString('base64'),
              user: image.user
            });
          } else {
            res.status(404).json({ 
              success: false, 
              message: 'Gambar tidak ditemukan' 
            });
          }
      } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat mengambil gambar');
      }
}

const getAllImages = async (req, res) => {
    try {
        // Ambil semua data gambar dari MongoDB
        const userId = req.username.userId;
        const images = await Image.find({ user: userId }).populate('user', 'username email');
        
        if (images.length > 0) {
            res.status(200).json({
              success: true,
              statusCode: res.statusCode,
              data: images.map(image => ({
                waktu: image.waktu,
                id: image._id,
                label: image.label,
                treatment: image.treatment,
                image: image.image.toString('base64'),
                user: image.user
              }))
            });
          } else {
            res.status(404).json({ 
              success: false, 
              message: 'Data gambar tidak ditemukan' 
            });
          }
      } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat mengambil data gambar');
      }
}

const deleteImage = async(req, res) => {
  const {id} = req.params
  const userId = req.username.userId
  try {
     const image = await Image.findOneAndDelete({ _id: id, user: userId });

    if (image) {
      res.json({
        status: 'success',
        statusCode: res.statusCode,
        message: "Delete Successfully"
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Image not found'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan saat menghapus gambar');
  }
  
}


module.exports = {uploadImage, getImage, getAllImages, deleteImage};

  // try {
    //       // Baca gambar yang diupload
    // const imageBuffer = fs.readFileSync(req.file.path);
    // const contentType = req.file.mimetype;

    // // Simpan gambar ke MongoDB
    // const newImage = new Image({
    //   data: imageBuffer,
    //   contentType: contentType
    // });
    // await newImage.save();

    // // Hapus file yang diupload dari sistem file
    // fs.unlinkSync(req.file.path);

    // res.status(200).send('Gambar berhasil diunggah dan disimpan.');
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).send('Terjadi kesalahan saat menyimpan gambar.');
    // }