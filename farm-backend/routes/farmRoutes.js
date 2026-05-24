const { Router } = require('express');
const auth = require('../middleware/auth');
const {
  validateObjectIdParam,
  validateFarmCreateInput,
  validateFarmUpdateInput,
} = require('../middleware/validate');
const {
  createFarm,
  getFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
} = require('../controllers/farmController');

const router = Router();

// Protect all farm routes
router.use(auth);

router.post('/', validateFarmCreateInput, createFarm);
router.get('/', getFarms);
router.get('/:id', validateObjectIdParam('id'), getFarmById);
router.put('/:id', validateObjectIdParam('id'), validateFarmUpdateInput, updateFarm);
router.delete('/:id', validateObjectIdParam('id'), deleteFarm);

module.exports = router;
