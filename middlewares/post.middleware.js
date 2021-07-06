const postMiddelwares = {
    fetchPost: async (req, res, next, postId) => {
        try {
            const returnedPost = await Post.findOne({ _id: postId });
            if (!returnedPost) return next(CustomError.notFound());

            req.post = returnedPost;
            next();
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
};

module.exports = postMiddelwares;
