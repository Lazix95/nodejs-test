const express = require('express');
const router = express.Router();

const categoriesController = require('./../controllers/categories');
const isAuth = require('./../middleware/is-auth');

const {isStaff} = require('./../utils/validations');
const {handleValidationResults} = require('./../utils/validationResultHandler');

router.get('/categories', isAuth, isStaff(), handleValidationResults, categoriesController.getCategories);

router.post('/category', isAuth, isStaff(), handleValidationResults, categoriesController.postCategory);

router.put('/category/:id', isAuth, isStaff(), handleValidationResults, categoriesController.putCategory);

router.delete('/category/:id', isAuth, isStaff(), handleValidationResults, categoriesController.deleteCategory);

module.exports = router;