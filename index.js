require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/database');
const sensorRoutes = require('./routes/sensorRoutes');

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
connectDB();

app.use('/api', sensorRoutes);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
