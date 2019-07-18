const express = require('express');
const router = express.Router();

const isAuth = require('./../middleware/is-auth');
const ordersController = require('./../controllers/orders');

router.get('/orders', isAuth, ordersController.getOrders);

router.post('/orders', isAuth, ordersController.postOrder);

router.patch('/orders/:id', isAuth, ordersController.patchOrder);

router.put('/orders', isAuth, ordersController.putOrder);

module.exports = router;