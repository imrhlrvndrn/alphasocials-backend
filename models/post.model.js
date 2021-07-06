const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        entity: { type: String, required: true, default: 'User' },
        user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        content: {
            type: String,
            required: true,
            max: [500, 'Post content cannot exceed 500 characters'],
        },
        comments: [{ comment: { type: Schema.Types.ObjectId, ref: 'Comment' } }],
        stats: {
            likes: { type: Number, default: 0 },
            comments: { type: Number, default: 0 },
            bookmarks: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
