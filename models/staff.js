const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staffSchema = Schema({
  fullName: {
    type: String,
    required: true
  },
  restaurantName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  staff: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Staff', staffSchema);