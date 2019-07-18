const express = require('express');
const router = express.Router()
const isAuth = require('./../middleware/is-auth');
const staffController = require('./../controllers/staff')

const {emailValidation} = require('./../utils/validations');
const {handleValidationResults} = require('./../utils/validationResultHandler');

router.get('/staff', isAuth, staffController.getStaff)

router.post('/staff',emailValidation(), handleValidationResults, isAuth, staffController.postStaff)

router.put('/staff/:id', isAuth, staffController.putStaff)

router.delete('/staff/:id', isAuth, staffController.deleteStaff)

module.exports = router