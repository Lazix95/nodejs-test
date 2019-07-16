const express = require('express');
const router = express.Router();

const authController = require('./../controllers/auth');
const {emailValidation, passwordValidation} = require('./../utils/validations');
const {handleValidationResults} = require('./../utils/validationResultHandler');

router.post('/signup', passwordValidation(), emailValidation(), handleValidationResults, authController.signup, authController.login);

router.post('/login', authController.login);

module.exports = router;