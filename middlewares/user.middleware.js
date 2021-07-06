const { User } = require('../models');
const { CustomError } = require('../services');

const userMiddleware = {
    fetchUser: async (req, res, next, userId) => {
        try {
            const returnedUser = await User.findOne({ _id: userId });
            if (!returnedUser) return next(CustomError.notFound(`User doesn't exist`));

            req.user = returnedUser;
            next();
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
};

module.exports = userMiddleware;
