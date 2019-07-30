const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
   email: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   fullName: {
      type: String,
      required: true
   },
   restaurantName: {
     type: String,
     required: true
   },
   qrCodes: [{
      type: Schema.Types.ObjectId,
      ref: 'QRcode'
   }],
   pricingPackage: {
      type: Number
   },
   products: [{
      type: Schema.Types.ObjectId,
      ref: 'Product'
   }]
});

module.exports = mongoose.model('User', userSchema);