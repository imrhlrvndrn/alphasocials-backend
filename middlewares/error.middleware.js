const { CustomError } = require('../services');
const { errorResponse } = require('../utils');

const errorHandler = (error, req, res, next) => {
    let data = { code: 500, status: 'failed', message: 'Internal server error' };

    if (error instanceof CustomError) {
        data = {
            code: error.code,
            status: error.status,
            message: error.message,
        };
    }

    return errorResponse(res, data);
};

module.exports = { errorHandler };
