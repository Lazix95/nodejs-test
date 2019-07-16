const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const qrcodeSchema = Schema({
   user: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
   },
   tableNumber: {
      type: String,
      default: 1
   }
});

module.exports = mongoose.model('QRcode', qrcodeSchema);