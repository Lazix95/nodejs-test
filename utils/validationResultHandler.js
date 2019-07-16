const {validationResult} = require("express-validator/check");

exports.handleValidationResults = (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
   }
   next()
}