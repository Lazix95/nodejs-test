const express = require('express');
const router = express.Router();

const categoriesController = require('./../controllers/categories');
const isAuth = require('./../middleware/is-auth');

router.get('/categories', isAuth, categoriesController.getCategories);

router.post('/category', isAuth, categoriesController.postCategory);

router.put('/category/:id', isAuth, categoriesController.putCategory);

router.delete('/category/:id', isAuth, categoriesController.deleteCategory);

module.exports = router;