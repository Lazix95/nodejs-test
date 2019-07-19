const Order = require('./../models/orders');
const io = require('./../socket');

//getOrders
exports.getOrders = async (req, res, next) => {
   try {
      const userId = req.userId;
      const restaurantId = req.restaurantId
      const orders = await Order.find({user: restaurantId})
      .populate({path: 'products.product', select:'category name price', populate: {path:'category', model:'Category', select: 'name'}});
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
      const userId = req.body.restaurantId ? req.body.restaurantId : req.userId;
      const products = req.body.products;
      const tableNumber = req.body.tableNumber;
      const qty = req.body.qty;
      const ordersAtTable = await Order.find({user: userId, tableNumber: tableNumber})
      const orderNumber = ordersAtTable.length + 1;
      let order = new Order({
         user: userId,
         orderNumber: orderNumber,
         tableNumber: tableNumber,
         qty: qty,
         products: products,
         accepted: false
      });
      order = await order.save();
      order = await Order.findById(order._id)
      .populate({path: 'products.product', select:'category name price', populate: {path:'category', model:'Category', select: 'name'}});

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
      const userId = req.userId;
      const restaurantId = req.restaurantId;
      const tableNumber = req.body.tableNumber;
      const orderId = req.params.id;
      let deleted = false;
      let acceptedOrder = await Order.findOne({user: restaurantId, tableNumber:tableNumber, accepted: true});
      let order = await Order.findById(orderId)
     if(acceptedOrder) {
      acceptedOrder.products = await mergeProducts([...acceptedOrder.products, ...order.products])
      await order.remove()
      deleted = true;
      await acceptedOrder.save()
      acceptedOrder = await Order.findById(acceptedOrder._id)
      .populate({path: 'products.product', select:'category name price', populate: {path:'category', model:'Category', select: 'name'}});
     } else {
        order.accepted = true;
        await order.save()
        acceptedOrder = await Order.findById(orderId)
        .populate({path: 'products.product', select:'category name price', populate: {path:'category', model:'Category', select: 'name'}});
     }
     io.getIO().sockets.in(restaurantId).emit('orderAccepted', {acceptedOrder: acceptedOrder, reqOrder: order, deleted: deleted});
      res.status(200).json(acceptedOrder)
   } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      if (!err.message) err.message = 'Something Went Wrong';
      next(err)
   }
};

// Delete orders when they are finished
exports.putOrder = async (req, res, next) => {
   try {
      const userId = req.userId;
      const restaurantId = req.restaurantId
      const orderId = req.params.id; 
      const order = await Order.findById(orderId);
      await order.remove();
      io.getIO().sockets.in(restaurantId).emit('orderFinished', order);
      res.status(201).json({message:'Order finished!'})
   } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      if (!err.message) err.message = 'Something Went Wrong';
      next(err)
   }
};

exports.deleteOrder = async (req, res, next) => {
   const restaurantId = req.restaurantId;
   const orderId = req.params.id;
   const order = await Order.findById(orderId)
   await order.remove()
   io.getIO().sockets.in(restaurantId).emit('orderRejected', order);
   res.status(200).json({message: 'Order ' + orderId + ' rejected.'})
} 

const mergeProducts = (products) => {
  return new Promise((resolve, reject) => {
   const passedElems = [];
   const arrayToReturn = [];
   for(let i = 0; i < products.length; i++) {
      let elem = products[i];
      let elemToPush = null;
      if(passedElems.filter(el => el.product.toString() == elem.product.toString()).length > 0) continue
      passedElems.push(elem)
      const filtered = products.filter(obj => obj.product.toString() == elem.product.toString())
      if(filtered.length >  0){
         elemToPush = {qty: 0, product: filtered[0].product}
         filtered.forEach(filtElm => {
         elemToPush.qty += filtElm.qty
         })
      } else {
         elemToPush = elem
      }
      arrayToReturn.push(elemToPush)
   };
   resolve(arrayToReturn)
  })
}