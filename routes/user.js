const expess = require('express');
const router = expess.Router();

const isAuth = require('./../middleware/is-auth');
const userController = require('./../controllers/user');

const {emailValidation, passwordValidation, changePaswordvalidation} = require('./../utils/validations');
const {handleValidationResults} = require('./../utils/validationResultHandler');

router.get('/user', isAuth, userController.getUser);
router.put('/user', isAuth, changePaswordvalidation(), handleValidationResults, userController.putUser);

module.exports = router;