const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = Schema({
   name: {
      type: String,
      required: true
   },
   products: [{
      type: Schema.Types.ObjectId,
      ref:'Product'
   }],
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   }
});

module.exports = mongoose.model('Category', categorySchema);