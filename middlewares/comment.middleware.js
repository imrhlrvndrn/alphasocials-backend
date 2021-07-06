const { Comment } = require('../models');
const { CustomError } = require('../services');

const commentMiddlewares = {
    fetchComment: async (req, res, next, commentId) => {
        try {
            const returnedComment = await Comment.findOne({ _id: commentId });
            if (!returnedComment)
                return next(CustomError.notFound(`Can't reply on a non-existing comment`));

            req.comment = returnedComment;
            next();
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
};

module.exports = commentMiddlewares;
