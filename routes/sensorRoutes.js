const express = require('express');
const sensorController = require('../cotrollers/sensorController');
const pumpController = require('../cotrollers/pumpController');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/sensor', sensorController.createSensor);
router.get('/sensor',verifyToken, sensorController.getSensor);
router.get('/sensors',verifyToken, sensorController.getSensors);
router.get('/highestSensor',verifyToken, sensorController.getHighestSensor);
router.get('/allSensors',verifyToken, sensorController.getAllSensors);

router.get('/keteranganSensor', sensorController.getSensorByKet);

router.post('/pump', pumpController.postPump);
router.get('/pump', pumpController.getPump);

module.exports = router;