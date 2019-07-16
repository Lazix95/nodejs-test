const Order = require('./../models/orders');
const io = require('./../socket');

exports.getOrders = async (req, res, next) => {
   try {
      const userId = req.userId;
      const orders = await Order.find({user: userId});
      res.status(200).json(orders)
   } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      if (!err.message) err.message = 'Something Went Wrong';
      next(err)
   }
};

// Create Orders
exports.postOrder = async (req, res, next) => {
   try {
      const userId = req.userId;
      const products = req.body.products;
      const qty = req.body.qty;
      console.log('Prods ', products);
      let order = new Order({
         user: userId,
         qty: qty,
         products: products,
         accepted: false
      });
      order = await order.save();
      order = await Order.findById(order._id).populate('products');
      io.getIO().sockets.in(userId).emit('orderCreated', order);
      res.status(201).json(order)
   } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      if (!err.message) err.message = 'Something Went Wrong';
      next(err)
   }
};

// Accept Orders
exports.patchOrder = async (req, res, next) => {
   try {
      const orderId = req.body.orderId;
      let order = await Order.findById(orderId);
      order.accepted = true;
      order = await order.save();
      io.getIO().emit('orderAccepted', order);
      res.status(200).json(order)
   } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      if (!err.message) err.message = 'Something Went Wrong';
      next(err)
   }
};

// Delete orders when they are finished
exports.putOrder = async (req, res, next) => {
   try {
      const orderId = req.body.orderId;
      let order = await Order.findById(orderId);
      order = await order.remove();
      io.getIO().emit('orderFinished', order);
      res.status(201).json({message:'Order finished!'})
   } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      if (!err.message) err.message = 'Something Went Wrong';
      next(err)
   }
};