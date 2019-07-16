const { body } = require('express-validator/check')
const User = require('../models/user')

exports.emailValidation = (req, res, next) => {
   return body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
           console.log('user ==', userDoc)
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
}

exports.passwordValidation = (req, res, next) => {
  return body('password').trim().isLength({min: 5})
}