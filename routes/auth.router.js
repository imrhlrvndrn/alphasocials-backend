const { authController } = require('../controllers');
const router = require('express').Router();

router.post('/signin', authController.signin);

router.post('/signup', authController.signup);

router.get('/signout', authController.signout);

module.exports = router;
