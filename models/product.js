const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
   name: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   show: {
      type: Boolean,
      default: false
   },
   image: {
      type: String,
   },
   category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
   }
});

module.exports = mongoose.model('Product', productSchema);