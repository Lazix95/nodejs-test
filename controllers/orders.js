const Order = require('./../models/orders');
const io = require('./../socket');

//getOrders
exports.getOrders = async (req, res, next) => {
   try {
      const userId = req.body.restaurantId ? req.body.restaurantId : req.userId;
      const orders = await Order.find({user: userId})
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
      const userId = req.body.restaurantId ? req.body.restaurantId : req.userId;
      const restaurantId = req.restaurantId;
      const tableNumber = req.body.tableNumber;
      const orderId = req.params.id;
      let acceptedOrder = await Order.findOne({user: restaurantId, tableNumber:tableNumber, accepted: true});
      let order = await Order.findById(orderId)
      console.log('oderr one ) )==', order, acceptedOrder)
     if(acceptedOrder) {
      console.log('Merge Products ======================== ', )
      acceptedOrder.products = mergeProducts([...acceptedOrder.products, ...order.products])
      await order.remove()
      await acceptedOrder.save()
      acceptedOrder = await Order.findById(acceptedOrder._id)
      .populate({path: 'products.product', select:'category name price', populate: {path:'category', model:'Category', select: 'name'}});
     } else {
        order.accepted = true;
        await order.save()
        acceptedOrder = await Order.findById(orderId)
        .populate({path: 'products.product', select:'category name price', populate: {path:'category', model:'Category', select: 'name'}});
     }
   
     // io.getIO().emit('orderAccepted', order);
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
      const userId = req.body.restaurantId ? req.body.restaurantId : req.userId;
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

const mergeProducts = (products) => {
   const passedElems = [];
   const arrayToReturn = [];
   for(let i = 0; i < products.length; i++) {
      let elem = products[i];
      if(passedElems.filter(el => el.product.toString() == elem.product.toString()).length > 0) break
      passedElems.push(elem)
      const filtered = products.filter(obj => obj.product.toString() == elem.product.toString())
      const elemToPush = {_id: filtered[0]._id, qty: 0, product: filtered[0].product}
      filtered.forEach(filtElm => {
         elemToPush.qty += filtElm.qty
      })
      arrayToReturn.push(elemToPush)
   };
   return arrayToReturn
}