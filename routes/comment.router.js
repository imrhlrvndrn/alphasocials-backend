const { requiresAuth, commentMiddlewares } = require('../middlewares');
const { commentController, replyController } = require('../controllers');

const router = require('express').Router();

router
    .route('/')
    .get(commentController.fetchComments)
    .post(requiresAuth, commentController.addComment);

router.param('commentId', commentMiddlewares.fetchComment);

router
    .route('/:commentId')
    .put(requiresAuth, commentController.modifyComment)
    .delete(requiresAuth, commentController.destroyComment);

router
    .route('/:commentId/reply')
    .post(requiresAuth, replyController.addReply)
    .put(requiresAuth, replyController.modifyReply)
    .delete(requiresAuth, replyController.destroyReply);

module.exports = router;
