const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const register = async (req, res) => {
    const {username, email, password} = req.body;

    const user = await User.findOne({email: email})
    if (!username || !password || !email)
    return res.status(400).json({
        success: false,
        statusCode: res.statusCode,
        message: 'Please complate input data',
    });
    const emailRegex = /@gmail\.(com|id)$/i;
    if (!emailRegex.test(email))
    return res.status(400).json({
        success: false,
        statusCode: res.statusCode,
        message: 'Invalid format email',
    })
    if (user)
    return res.status(400).json({
        success: false,
        statusCode: res.statusCode,
        message: 'Your email has been registered!',
    })

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await User.create({
            username: username,
            email:email,
            password:hashPassword,
        });
        res.json({
            success: true,
            statusCode: res.statusCode,
            message: 'Register Successfully',
        });
    } catch (err) {
        res.json({
            success: false,
            statusCode: res.statusCode,
            error: {
                message: err.message,
                uri: req.originalUrl,
            },
        });
        console.log(error);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({email})

        const emailRegex = /@gmail\.(com|id)$/i;
        if (!emailRegex.test(email))
        return res.status(400).json({
            success: false,
            statusCode: res.statusCode,
            message: 'Invalid format email',
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                statusCode: res.statusCode,
                message: "User Not Found",
            });
        }
    
        const match = await bcrypt.compare(password, user.password);
        if (!match)
        return res.status(400).json({
            success: false,
            statusCode: res.statusCode,
            message: "Password Wrong!!!",
        });
    
        const userId = user._id;
        const userName = user.username;
        const emailId = user.email;
    
        const accessToken = jwt.sign({
            userId, userName, emailId
        }, process.env.ACCESS_TOKEN_SECRET);
        const refreshToken = jwt.sign({
            userId, userName, emailId
        }, process.env.REFRESH_TOKEN_SECRET);
    
        await User.updateOne(
            { _id: userId }, // Query untuk menemukan dokumen dengan ID yang sesuai
            { $set: { refresh_token: refreshToken } }
        );
    
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
    
        res.json({
            success: true,
            statusCode: res.statusCode,
            message: "Login Success",
            data: {
              userId,
              email,
              userName,
              accessToken,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            statusCode: res.statusCode,
            error: {
                message: "Internal Server Error",
                uri: req.originalUrl,
            },
        });
    }
}

// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         // Mencari pengguna berdasarkan alamat email
//         const user = await User.findOne({ email });

//         // Jika pengguna tidak ditemukan, kembalikan respons dengan kesalahan
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 statusCode: res.statuscode,
//                 error: {
//                     message: "Email Not Found",
//                     uri: req.originalUrl,
//                 },
//             });
//         }

//         // Memeriksa kecocokan kata sandi dengan menggunakan bcrypt
//         const match = await bcrypt.compare(password, user.password);
//         if (!match) {
//             return res.status(400).json({
//                 success: false,
//                 statusCode: res.statusCode,
//                 message: "Password Wrong!!!",
//             });
//         }

//         // Jika kata sandi cocok, buat token akses dan refresh token
//         const accessToken = jwt.sign({
//             userId: user._id,
//             userName: user.username,
//             emailId: user.email,
//         }, process.env.ACCESS_TOKEN_SECRET);

//         const refreshToken = jwt.sign({
//             userId: user._id,
//             userName: user.username,
//             emailId: user.email,
//         }, process.env.REFRESH_TOKEN_SECRET);

//         // Simpan refresh token ke dalam dokumen pengguna
//         await User.updateOne(
//             { _id: user._id },
//             { $set: { refresh_token: refreshToken } }
//         );

//         // Mengatur cookie refreshToken
//         res.cookie("refreshToken", refreshToken, {
//             httpOnly: true,
//             maxAge: 24 * 60 * 60 * 1000,
//         });

//         // Memberikan respons berhasil dengan data pengguna dan token akses
//         res.json({
//             success: true,
//             statusCode: res.statusCode,
//             message: "success",
//             data: {
//                 userId: user._id,
//                 email: user.email,
//                 userName: user.username,
//                 accessToken,
//             },
//         });
//     } catch (error) {
//         // Menangani kesalahan
        // console.error(error);
        // res.status(500).json({
        //     success: false,
        //     statusCode: res.statusCode,
        //     error: {
        //         message: "Internal Server Error",
        //         uri: req.originalUrl,
        //     },
        // });
//     }
// }


// const logout = async (req, res) => {}

module.exports = { register, login };