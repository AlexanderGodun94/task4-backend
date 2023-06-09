const logger = require('./logger');
const errorMessages = require('./errorMessages');

class AppError extends Error {
  constructor(settings) {
    super();
    settings = (settings || {});
    this.name = "AppError";

    this.type = (settings.type || "Application");
    this.message = (settings.message || errorMessages.SERVER_ERROR);
    this.err = (settings.err || {});
    this.stackOfParentErr = this.err.stack;
    this.details = (settings.details || {});
    this.status = (settings.status || 500);

    //if (settings.status === 500)
    //console.error(this);
    // console.error(this.err)

    this.status >= 500 ? logger.error(this) : logger.warn(this);
  }

  toJSON() {
    return {
      message: this.message,
      stack: this.stack,
      details: this.details,
      error: (this.err instanceof Error) ? {
        message: this.err.message,
        stack: this.err.stack,
        error: this.err.stack ? this.err.error : this.err
      } : this.err
    };
  }
}

module.exports = AppError;
