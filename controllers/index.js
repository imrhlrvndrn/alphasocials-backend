const userController = require('./user');
const postController = require('./post');
const authController = require('./auth');
const { commentController, replyController } = require('./comment');

module.exports = {
    authController,
    postController,
    userController,
    replyController,
    commentController,
};
