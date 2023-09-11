class OtpValidationError extends Error {
    constructor(message, statusCode) {
      super(message)
      this.statusCode = statusCode
    }
  }
  
  const createOtpValidationError = (msg, statusCode) => {
    return new OtpValidationError(msg, statusCode)
  }
  
  module.exports = { createOtpValidationError, OtpValidationError }
  