const { Comment, Post } = require('../../models');
const { CustomError } = require('../../services');
const { successResponse } = require('../../utils');

const commentController = {
    fetchComments: async (req, res, next) => {
        try {
            const returnedComments = await Comment.find();
            if (!returnedComments.length) return next(CustomError.notFound());

            return successResponse(res, {
                data: { comments: returnedComments },
                toast: {
                    status: 'success',
                    message: 'Fetched all the comments',
                },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    addComment: async (req, res, next) => {
        const { _id: userId } = req.auth;
        const { content, postId } = req.body;

        const newComment = new Comment({
            post: postId,
            user: userId,
            content,
        });

        try {
            const postToBeModified = await Post.findOne({ _id: postId });
            if (!postToBeModified)
                return next(CustomError.notFound(`Couldn't add comment to a non-existing post`));

            const savedComment = await newComment.save();
            if (!savedComment) return next(CustomError.serverError(`Couldn't add new comment`));

            postToBeModified.comments.push({ comment: savedComment });
            postToBeModified.stats.comments += 1;
            await postToBeModified.save();

            return successResponse(res, {
                success: true,
                data: {
                    comment: savedComment,
                },
                toast: {
                    status: 'success',
                    message: 'You added new comment',
                },
            });
        } catch (error) {
            return next(error);
        }
    },
    modifyComment: async (req, res, next) => {
        const { comment } = req;
        const { content } = req.body;

        if (comment.user !== userId) return next(CustomError.unAuthorized());
        try {
            comment.content = content;
            const modifiedComment = await comment.save();
            if (!modifiedComment)
                return next(CustomError.serverError(`Couldn't modify comment. Please try again`));

            return successResponse(res, {
                data: {
                    comment: modifiedComment,
                },
                toast: {
                    status: 'success',
                    message: 'Successfully modified comment',
                },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    destroyComment: async (req, res, next) => {
        const { comment } = req;
        const { _id: userId } = req.auth;

        try {
            const returnedPost = await Post.findOne({ _id: comment.post });
            if (!returnedPost) return next(CustomError.notFound(`Post not found`));

            const destroyedComment = await Comment.findOneAndDelete({
                _id: comment._id,
                user: userId,
            });
            if (!destroyedComment)
                return next(CustomError.serverError(`Couldn't destroy comment. Please try again`));

            returnedPost.comments = returnedPost.comments.filter(
                ({ comment }) => destroyedComment.id !== comment
            );
            returnedPost.stats.comments -= 1;

            await returnedPost.save();

            return successResponse(res, {
                data: {
                    comment: destroyedComment,
                },
                toast: {
                    status: 'success',
                    message: 'Destroyed comment',
                },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
};

const replyController = {
    addReply: async (req, res, next) => {
        const { comment } = req;
        const { content } = req.body;
        const { commentId } = req.params;
        const { _id: userId } = req.auth;

        const newReply = new Comment({
            comment: commentId,
            user: userId,
            content,
        });

        try {
            const returnedPost = await Post.findOne({ _id: comment.post });
            if (!returnedPost) return next(CustomError.notFound());

            const savedReply = await newReply.save();

            comment.replies.push({ reply: savedReply });
            returnedPost.stats.comments += 1;
            await comment.save();
            const modifiedPost = await returnedPost.save();

            return successResponse(res, {
                success: true,
                data: {
                    reply: savedReply,
                    post: modifiedPost,
                },
                toast: {
                    status: 'success',
                    message: 'Added new reply',
                },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    modifyReply: async (req, res, next) => {
        const { comment } = req;
        const { _id: userId } = req.auth;
        const { replyCommentId, content } = req.body;

        try {
            const returnedReply = await Comment.findOneAndUpdate(
                { _id: replyCommentId, user: userId },
                { content, user: userId },
                { new: true }
            );
            if (!returnedReply) return next(CustomError.notFound(`Can't find your reply`));

            return successResponse(res, {
                data: {
                    reply: returnedReply,
                },
                toast: {
                    status: 'success',
                    message: 'Modified reply',
                },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    destroyReply: async (req, res, next) => {
        const { comment } = req;
        const { _id: userId } = req.auth;
        const { replyCommentId } = req.body;

        try {
            const returnedPost = await Post.findOne({ _id: comment.post });
            if (!returnedPost) return next(CustomError.notFound());

            const returnedReply = await Comment.findOneAndDelete({
                _id: replyCommentId,
                user: userId,
            });
            if (!returnedReply)
                return next(CustomError.serverError(`Couldn't delete reply. Please try again`));

            comment.replies = comment.replies.filter(({ reply }) => replyCommentId !== reply);
            returnedPost.stats.comments -= 1;
            await comment.save();
            const modifiedPost = await returnedPost.save();

            return successResponse(res, {
                data: { reply: returnedReply, post: modifiedPost },
                toast: {
                    status: 'success',
                    message: 'Successfully deleted reply',
                },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
};

module.exports = { commentController, replyController };
