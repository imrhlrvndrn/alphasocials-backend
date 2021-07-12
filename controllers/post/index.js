const { Post, User } = require('../../models');
const { CustomError } = require('../../services');
const { successResponse } = require('../../utils');

const postController = {
    fetchPost: async (req, res, next) => {
        const { post } = req;
        const { select, populate } = req.query;
        try {
            const transformedPost = post.select(select || []).populate(populate || '');
            return successResponse(res, {
                data: { post: transformedPost },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    fetchPosts: async (req, res, next) => {
        const { type = 'USER' } = req.query;
        const { _id: userId } = req.auth;

        try {
            switch (type) {
                case 'USER': {
                    const returnedPosts = await Post.find({ user: userId })
                        .limit(10)
                        .populate({ path: 'user', select: ['full_name', 'avatar'] });
                    if (!returnedPosts.length)
                        return next(CustomError.notFound(`No posts to show`));

                    return successResponse(res, {
                        data: {
                            posts: returnedPosts,
                        },
                    });
                }

                case 'FEED': {
                    const returnedUser = await User.findById(userId);
                    if (!returnedUser) return next(CustomError.notFound(`User doesn't exist`));

                    const returnedPosts = await Post.find({});
                    if (!returnedPosts.length) return next(CustomError.serverError());
                }

                default: {
                    return next(CustomError.badRequest(`Invalid operation type`));
                }
            }
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    addPost: async (req, res, next) => {
        const { _id: userId } = req.auth;
        const { content } = req.body;

        const newPost = new Post({
            user: userId,
            content,
        });

        try {
            const returnedUser = await User.findOne({ _id: userId });
            if (!returnedUser) return next(CustomError.notFound(`User not found`));

            const savedPost = await newPost.save();
            if (!savedPost)
                return next(CustomError.serverError(`Couldn't add new post. Please try again`));

            returnedUser.posts.push({ post: savedPost });
            await returnedUser.save();

            return successResponse(res, {
                data: {
                    post: {
                        ...savedPost._doc,
                        user: {
                            _id: returnedUser.id,
                            full_name: returnedUser.full_name,
                            avatar: returnedUser.avatar,
                        },
                    },
                },
                toast: {
                    status: 'success',
                    message: 'Added new post',
                },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    modifyPost: async (req, res, next) => {
        const { post } = req;
        const { _id: userId } = req.auth;
        const { content } = req.body;

        if (userId !== post.user.toString()) return next(CustomError.unAuthorized());
        try {
            post.content = content;
            const modifiedPost = await post.save();

            return successResponse(res, {
                data: { post: modifiedPost },
                toast: {
                    status: 'success',
                    message: 'Successfully modified post',
                },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    destroyPost: async (req, res, next) => {
        const { post } = req;
        const { _id: userId } = req.auth;

        if (userId !== post.user.toString()) return next(CustomError.unAuthorized());
        try {
            const returnedUser = await User.findOne({ _id: userId });
            if (!returnedUser) return next(CustomError.notFound(`User not found`));

            const destroyedPost = await Post.findOneAndDelete({ _id: post._id, user: userId });
            if (!destroyedPost)
                return next(
                    CustomError.serverError(`Couldn't destroy your post. Please try again`)
                );

            returnedUser.posts = returnedUser.posts.filter(({ post }) => post !== destroyedPost.id);
            await returnedUser.save();

            return successResponse(res, {
                data: { post: destroyedPost },
                toast: {
                    status: 'success',
                    message: 'Successfully destroyed your post',
                },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    likePost: async (req, res, next) => {
        const { post } = req;
        const { _id: userId } = req.auth;

        try {
            const returnedUser = await User.findOne({ _id: userId });
            if (!returnedUser) return next(CustomError.notFound(`User not found.`));

            post.stats.likes += 1;
            const modifiedPost = await post.save();

            returnedUser.likes.push({ post: modifiedPost });
            await returnedUser.save();

            return successResponse(res, {
                data: {
                    stats: modifiedPost.stats,
                },
                toast: {
                    status: 'success',
                    message: 'Added to liked posts',
                },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    dislikePost: async (req, res, next) => {
        const { post } = req;
        const { _id: userId } = req.auth;

        try {
            const returnedUser = await User.findOne({ _id: userId });
            if (!returnedUser) return next(CustomError.notFound(`User not found.`));

            post.stats.likes -= 1;
            const modifiedPost = await post.save();

            returnedUser.likes = returnedUser.likes.filter(
                (likedPost) => likedPost.post !== post.id
            );
            await returnedUser.save();

            return successResponse(res, {
                data: {
                    stats: modifiedPost.stats,
                },
                toast: {
                    status: 'success',
                    message: 'Removed from liked posts',
                },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    bookmarkPost: async (req, res, next) => {
        const { post } = req;
        const { _id: userId } = req.auth;

        try {
            const returnedUser = await User.findOne({ _id: userId });
            if (!returnedUser) return next(CustomError.notFound(`User not found.`));

            post.stats.bookmarks += 1;
            const modifiedPost = await post.save();

            returnedUser.bookmarks.push({ post: modifiedPost });
            await returnedUser.save();

            return successResponse(res, {
                data: {
                    stats: modifiedPost.stats,
                },
                toast: {
                    status: 'success',
                    message: 'Added to bookmarks',
                },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    unbookmarkPost: async (req, res, next) => {
        const { post } = req;
        const { _id: userId } = req.auth;

        try {
            const returnedUser = await User.findOne({ _id: userId });
            if (!returnedUser) return next(CustomError.notFound(`User not found.`));

            post.stats.bookmarks -= 1;
            const modifiedPost = await post.save();

            returnedUser.bookmarks = returnedUser.bookmarks.filter(
                (likedPost) => likedPost.post !== post.id
            );
            await returnedUser.save();

            return successResponse(res, {
                data: {
                    stats: modifiedPost.stats,
                },
                toast: {
                    status: 'success',
                    message: 'Removed from bookmarks',
                },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
};

module.exports = postController;
