const { userController } = require('../controllers');
const { requiresAuth } = require('../middlewares');
const userMiddleware = require('../middlewares/user.middleware');

const router = require('express').Router();

router.route('/').get();

router.param('userId', userMiddleware.fetchUser);

router.route('/:userId').all(requiresAuth).get(userController.me).put(userController.modifyUser);

router
    .route('/:userId/follow')
    .all(requiresAuth)
    .post(userController.followUser)
    .delete(userController.unfollowUser);

module.exports = router;
