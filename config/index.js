require('dotenv').config();

const { MONGODB_URI, JWT_SECRET, PORT } = process.env;

module.exports = {
    PORT,
    MONGODB_URI,
    JWT_SECRET,
};
