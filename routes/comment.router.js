const {
    requiresAuth,
    commentMiddlewares: { fetchComment },
} = require('../middlewares');
const {
    commentController: { fetchComments, addComment, modifyComment, destroyComment },
    replyController: { addReply, modifyReply, destroyReply },
} = require('../controllers');

const router = require('express').Router();

router.route('/').get(fetchComments).post(requiresAuth, addComment);

router.param('commentId', fetchComment);

router.route('/:commentId').put(requiresAuth, modifyComment).delete(requiresAuth, destroyComment);

router
    .route('/:commentId/reply')
    .post(requiresAuth, addReply)
    .put(requiresAuth, modifyReply)
    .delete(requiresAuth, destroyReply);

module.exports = router;
