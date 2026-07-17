// errorHandler.js
// Express error-handling middleware (note the 4 arguments - that's what
// tells Express this is an error handler, not a regular middleware).
// Catches errors thrown/passed via next(error) anywhere in the app so
// every controller doesn't need its own try/catch error formatting.

function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Something went wrong on the server",
  });
}

module.exports = errorHandler;
