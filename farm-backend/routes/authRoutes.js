const { Router } = require('express');

const { register, login } = require('../controllers/authController');
const { validateRegisterInput, validateLoginInput } = require('../middleware/validate');

const router = Router();

router.post('/register', validateRegisterInput, register);
router.post('/login', validateLoginInput, login);

module.exports = router;
