const multer = require("multer");

function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, req, res, next) {
  if (error instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: "Image size must be 2MB or less",
      LIMIT_UNEXPECTED_FILE: "Unexpected image field name",
    };

    return res.status(400).json({
      success: false,
      message: messages[error.code] || error.message,
    });
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Server error",
    errors: error.errors || undefined,
  });
}

module.exports = { errorHandler, notFound };
