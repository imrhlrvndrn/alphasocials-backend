const {
    userController: { modifyUser, destroyUser, me, followUser, unfollowUser, verifyUsername },
} = require('../controllers');
const { requiresAuth } = require('../middlewares');
const { fetchUser } = require('../middlewares/user.middleware');

const router = require('express').Router();

router.route('/').get();

router.route('/verify-username').post(verifyUsername);

router.param('userId', fetchUser);

router.route('/:userId').all(requiresAuth).post(me).put(modifyUser).delete(destroyUser);

router.route('/:userId/follow').all(requiresAuth).post(followUser).delete(unfollowUser);

module.exports = router;
