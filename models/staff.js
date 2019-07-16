const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staffSchema = Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('Order', staffSchema);