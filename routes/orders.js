const express = require('express');
const router = express.Router();

const isAuth = require('./../middleware/is-auth');
const ordersController = require('./../controllers/orders');

router.get('/orders', isAuth, ordersController.getOrders);

router.post('/orders', isAuth, ordersController.postOrder);

router.patch('/orders/:id', isAuth, ordersController.patchOrder);

router.put('/orders/:id', isAuth, ordersController.putOrder);

router.delete('/orders/:id', isAuth, ordersController.deleteOrder)

module.exports = router;