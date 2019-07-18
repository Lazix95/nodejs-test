const { body } = require('express-validator/check')
const User = require('../models/user')
const Staff = require('./../models/staff')
const bcrypt = require('bcryptjs')

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

exports.changePaswordvalidation = (req, res, next) => {
  return body('currentPassword').trim().custom( async (value, {req}) => {
    if(!value) return Promise.resolve();
    if(req.body.password && req.body.password.length < 6) return Promise.reject('Password is too short!');
    const userId = req.userId;
    const user = await User.findById(userId)
    const isEqual = await bcrypt.compare(value, user.password);
    if(!isEqual) return Promise.reject('Current Password is not corrent')
  })
}

exports.isStaff = (req, res, next) => {
  return body('email').custom(async (value, {req}) => {
    const staff = await Staff.findById(req.userId)
    console.log(staff)
    if(staff) return Promise.reject('Access denied!')
  })
}