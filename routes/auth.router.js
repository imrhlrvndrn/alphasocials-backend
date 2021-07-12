const {
    authController: { signin, signup, signout },
} = require('../controllers');
const router = require('express').Router();

router.post('/signin', signin);

router.post('/signup', signup);

router.get('/signout', signout);

module.exports = router;
