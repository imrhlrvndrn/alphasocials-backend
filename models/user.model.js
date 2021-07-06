const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        entity: { type: String, required: true, default: 'User' },
        full_name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: {
            url: { type: String },
        },
        bio: { type: String, default: '' },
        external_links: [
            {
                name: { type: String, required: true },
                url: { type: String, required: true },
                type: {
                    type: String,
                    required: true,
                    enum: ['website', 'social'],
                },
            },
        ],
        bookmarks: [{ post: { type: Schema.Types.ObjectId, ref: 'Post' } }],
        likes: [{ post: { type: Schema.Types.ObjectId, ref: 'Post' } }],
        pinned_post: { post: { type: Schema.Types.ObjectId, ref: 'Post' } },
        posts: [{ post: { type: Schema.Types.ObjectId, ref: 'Post' } }],
        followers: [{ user: { type: Schema.Types.ObjectId, ref: 'User' } }],
        following: [{ user: { type: Schema.Types.ObjectId, ref: 'User' } }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
