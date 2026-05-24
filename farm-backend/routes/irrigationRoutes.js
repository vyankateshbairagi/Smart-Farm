const { Router } = require('express');
const { recommend } = require('../controllers/irrigationController');
const { validateIrrigationInput } = require('../middleware/validate');

const router = Router();

router.post('/recommend', validateIrrigationInput, recommend);

module.exports = router;
