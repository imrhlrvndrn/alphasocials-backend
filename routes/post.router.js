const router = require('express').Router();
const { postController } = require('../controllers');
const { requiresAuth, postMiddlewares } = require('../middlewares');

router.route('/').all(requiresAuth).get().post(postController.addPost);

router.param('postId', postMiddlewares.fetchPost);

router
    .route('/:postId')
    .all(requiresAuth)
    .get(postController.fetchPost)
    .put(postController.modifyPost)
    .delete(postController.destroyPost);

router
    .route('/:postId/like')
    .all(requiresAuth)
    .post(postController.likePost)
    .delete(postController.dislikePost);

router
    .route('/:postId/bookmark')
    .all(requiresAuth)
    .post(postController.bookmarkPost)
    .delete(postController.unbookmarkPost);

module.exports = router;
