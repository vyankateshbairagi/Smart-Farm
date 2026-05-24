const { Router } = require('express');

const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const farmRoutes = require('./farmRoutes');
const cropRoutes = require('./cropRoutes');
const irrigationRoutes = require('./irrigationRoutes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/farms', farmRoutes);
router.use('/crops', cropRoutes);
router.use('/irrigation', irrigationRoutes);

module.exports = router;
