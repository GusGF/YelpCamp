class ExpressError extends Error {
  constructor(message, statusCode) {
    // calls the error constructor
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}
module.exports = ExpressError;