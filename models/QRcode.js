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
   },
   qrCodeNumber: {
      type: Number,
      required: true,
      immutable: true
   }
});

module.exports = mongoose.model('QRcode', qrcodeSchema);