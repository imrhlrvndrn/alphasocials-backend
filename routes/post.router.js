const router = require('express').Router();
const {
    postController: {
        addPost,
        fetchPost,
        fetchPosts,
        modifyPost,
        destroyPost,
        dislikePost,
        likePost,
        bookmarkPost,
        unbookmarkPost,
    },
} = require('../controllers');
const {
    requiresAuth,
    postMiddlewares: { fetchPost: fetchPostMiddleware },
} = require('../middlewares');

router.route('/').all(requiresAuth).get(fetchPosts).post(addPost);

router.param('postId', fetchPostMiddleware);

router
    .route('/:postId')
    .get(fetchPost)
    .put(requiresAuth, modifyPost)
    .delete(requiresAuth, destroyPost);

router.route('/:postId/like').all(requiresAuth).post(likePost).delete(dislikePost);

router.route('/:postId/bookmark').all(requiresAuth).post(bookmarkPost).delete(unbookmarkPost);

module.exports = router;
