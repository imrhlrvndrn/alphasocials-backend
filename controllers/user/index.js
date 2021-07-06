const { User } = require('../../models');
const { CustomError } = require('../../services');
const { successResponse } = require('../../utils');

const userController = {
    me: async (req, res, next) => {
        const { user } = req;
        const { populate } = req.query;

        try {
            transformedUser = user.populate(populate || '');
            return successResponse(res, {
                data: {
                    user: { ...user._doc, password: undefined },
                },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    modifyUser: async (req, res, next) => {
        const { user } = req;
        const { _id: userId } = req.auth;
        const { username, email } = req.body;

        try {
            if (!!email) {
                const emailExists = await User.exists({ email: email });
                if (emailExists)
                    return next(
                        CustomError.alreadyExists(
                            `${email} is associated with another account. Please use another email`
                        )
                    );
            }

            if (!!username) {
                const usernameExists = await User.exists({ username: username });
                if (usernameExists)
                    return next(
                        CustomError.alreadyExists(
                            `${username} is already taken. Please choose another username`
                        )
                    );
            }

            Object.keys(req.body).forEach((key) => {
                if (key in user) {
                    user[key] = req.body[key];
                }
            });

            const modifiedUser = await user.save();

            return successResponse(res, {
                data: { user: { ...modifiedUser._doc, password: undefined } },
                toast: {
                    status: 'success',
                    message: 'Successfully modified user data',
                },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    destroyUser: async (req, res, next) => {
        const { user } = req;
        const { _id: userId } = req.auth;

        try {
            const destroyedUser = await User.findOneAndDelete({ _id: userId });
            if (!destroyedUser)
                return next(
                    CustomError.serverError(`Couldn't destory your account. Please try again`)
                );

            return successResponse(res, {
                data: { user: destroyedUser },
                toast: {
                    status: 'success',
                    message: 'Destroyed your account',
                },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    followUser: async (req, res, next) => {
        const { user } = req;
        const { _id: userId } = req.auth;

        try {
            const returnedFollower = await User.findOne({ _id: userId });
            if (!returnedFollower) return next(CustomError.notFound(`User doesn't exist`));

            returnedFollower.following.push({ user });
            user.followers.push({ user: returnedFollower });

            await returnedFollower.save();
            await user.save();

            return successResponse(res, {
                data: {
                    user: { ...returnedFollower._doc, password: undefined },
                },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    unfollowUser: async (req, res, next) => {
        const { user } = req;
        const { _id: userId } = req.auth;

        try {
            const returnedFollower = await User.findOne({ _id: userId });
            if (!returnedFollower) return next(CustomError.notFound(`User doesn't exist`));

            returnedFollower.following = returnedFollower.following.filter(
                (followedUser) => followedUser.user !== user.id
            );
            user.followers = returnedFollower.followers.filter(
                (follower) => follower.user !== user.id
            );

            await returnedFollower.save();
            await user.save();

            return successResponse(res, {
                data: {
                    user: { ...returnedFollower._doc, password: undefined },
                },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
};

module.exports = userController;
