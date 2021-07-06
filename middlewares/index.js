const userMiddlewares = require('./user.middleware');
const postMiddlewares = require('./post.middleware');
const { requiresAuth } = require('./auth.middleware');
const { errorHandler } = require('./error.middleware');
const commentMiddlewares = require('./comment.middleware');

module.exports = {
    errorHandler,
    requiresAuth,
    userMiddlewares,
    postMiddlewares,
    commentMiddlewares,
};
