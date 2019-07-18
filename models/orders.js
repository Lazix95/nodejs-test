const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ordersSchema = Schema({
   orderedAt: Date,
   accepted: {
      type: Boolean,
      default: false
   },
   tableNumber: {
      type: String,
      required: true
   },
   orderNumber: {
      type: Number
   },
   products: [{
      product: {
         type: Schema.Types.ObjectId,
         ref: 'Product'
      },
      qty: {
         type: Number,
         default: 1
      },
   }],
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   },
});

module.exports = mongoose.model('Order', ordersSchema);