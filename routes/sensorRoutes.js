const express = require('express');
const sensorController = require('../cotrollers/sensorController');
const pumpController = require('../cotrollers/pumpController');
const router = express.Router();

router.post('/sensor', sensorController.createSensor);
router.get('/sensor', sensorController.getSensor);
router.get('/sensors', sensorController.getSensors);
router.get('/highestSensor', sensorController.getHighestSensor);

router.post('/pump', pumpController.postPump);
router.get('/pump', pumpController.getPump);

module.exports = router;