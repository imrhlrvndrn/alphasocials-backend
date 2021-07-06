const mongoose = require('mongoose');
const { MONGODB_URI } = require('./');

const connectDB = () => {
    try {
        mongoose.connect(
            MONGODB_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
            },
            () => console.log('MongoDB connection established')
        );
    } catch (error) {
        console.error('Error connecting to MongoDB => ', error);
    }
};

module.exports = connectDB;
