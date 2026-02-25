const errorHandler = (err, req, res, next) => {
    // Set status code. Default to 500 if it's still 200 (which means unhandled server error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode);

    // Return detailed error in dev, but minimal in prod
    res.json({
        error: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };
