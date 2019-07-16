const express = require('express');
const router = express.Router();

const productsController = require('./../controllers/products');
const isAuth = require('./../middleware/is-auth');

router.get('/product', isAuth, productsController.getProducts);

router.post('/product', isAuth, productsController.postProduct);

router.put('/product', isAuth, productsController.putProduct);

router.delete('/product/:id', isAuth, productsController.deleteProduct);

module.exports = router;