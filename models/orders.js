const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ordersSchema = Schema({
   orderedAt: Date,
   accepted: {
      type: Boolean,
      default: false
   },
   qty: {
      type: Number,
      default: 1
   },
   products: [{
      type: Schema.Types.ObjectId,
      ref: 'Product'
   }],
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   },
});

module.exports = mongoose.model('Order', ordersSchema);