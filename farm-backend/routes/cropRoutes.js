const { Router } = require('express');
const auth = require('../middleware/auth');
const {
  validateObjectIdParam,
  validateCropCreateInput,
  validateCropUpdateInput,
} = require('../middleware/validate');
const {
  createCrop,
  getCropsByFarm,
  updateCrop,
  deleteCrop,
} = require('../controllers/cropController');

const router = Router();

// Protect crop routes
router.use(auth);

router.post('/', validateCropCreateInput, createCrop);
router.get('/:farmId', validateObjectIdParam('farmId'), getCropsByFarm);
router.put('/:id', validateObjectIdParam('id'), validateCropUpdateInput, updateCrop);
router.delete('/:id', validateObjectIdParam('id'), deleteCrop);

module.exports = router;
