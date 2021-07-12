const cors = require('cors');
const express = require('express');
const { PORT } = require('./config');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

// importing middlewares
const { errorHandler, requiresAuth } = require('./middlewares');

// importing route handlers
const { authRoutes, commentRoutes, postRoutes, userRoutes } = require('./routes');

const app = express();
const APP_PORT = PORT || 4000;

app.set('Access-Control-Allow-Credentials', true);
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.get('/verify', requiresAuth, (req, res, next) => {
    res.status(200).json({ message: 'Token is valid' });
});

app.use(errorHandler);

connectDB();

app.listen(APP_PORT, () => console.log(`Server is running on PORT ${APP_PORT}`));
