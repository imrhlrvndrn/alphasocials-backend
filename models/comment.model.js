const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        entity: { type: String, required: true, default: 'Comment' },
        post: { type: Schema.Types.ObjectId, ref: 'Post' },
        comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
        user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        content: {
            type: String,
            required: true,
            max: [500, 'Comment content cannot exceed 500 characters'],
        },
        replies: [{ reply: { type: Schema.Types.ObjectId, ref: 'Comment' } }],
        stats: {
            likes: { type: Number, default: 0 },
            replies: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
