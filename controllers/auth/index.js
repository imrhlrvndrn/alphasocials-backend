const bcrypt = require('bcrypt');
const { User } = require('../../models');
const { JWT, CustomError } = require('../../services');
const { successResponse } = require('../../utils');

const authController = {
    signin: async (req, res, next) => {
        const { username, password } = req.body;

        try {
            // Check if username exists
            const user = await User.findOne({ username: username });
            if (!user) return next(CustomError.invalidCredentials());

            // Check if password is correct
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) return next(CustomError.invalidCredentials());

            // Create and assign a token
            const token = JWT.sign({ _id: user._id });
            res.cookie('token', token, { path: '/', httpOnly: true });
            res.cookie('userId', user._id.toString(), { path: '/' });

            return successResponse(res, {
                success: true,
                data: {
                    token,
                    user: { ...user._doc, password: undefined },
                },
                toast: {
                    status: 'success',
                    message: `You're successfully logged in`,
                },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    signup: async (req, res, next) => {
        const { email, full_name, username, password, avatar = {} } = req.body;
        try {
            // Check if username exists
            const usernameExists = await User.exists({
                username: username,
            });
            if (usernameExists)
                return next(
                    CustomError.alreadyExists(
                        `${username} is associated with another account. Please use another username`
                    )
                );

            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                username: username || email.split('@')[0],
                full_name,
                email,
                password: hashedPassword,
                avatar: avatar.url ? avatar : { url: '' },
            });

            const savedUser = await newUser.save();

            // Create and assign a token
            const token = JWT.sign({ id: savedUser._id });
            res.cookie('token', token, { path: '/', httpOnly: true });
            res.cookie('userId', savedUser._id.toString(), { path: '/' });

            return successResponse(res, {
                code: 201,
                success: true,
                data: { token, user: { ...savedUser._doc, password: undefined } },
                toast: {
                    status: 'success',
                    message: 'Created new user',
                },
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    signout: (req, res) => {
        res.clearCookie('token');
        res.clearCookie('userId');

        return successResponse(res, {
            data: { message: "You're logged out" },
            toast: {
                status: 'success',
                message: "You're logged out",
            },
        });
    },
};

module.exports = authController;
