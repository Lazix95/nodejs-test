const Staff = require('./../models/staff')
const bcrypt = require('bcryptjs');

exports.getStaff = async (req, res, next) => {
  try {
    const userId = req.userId;
    const staff = await Staff.find({restaurantId: userId})
    res.status(200).json(staff)
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    if (!err.message) err.message = 'Something Went Wrong';
    next(err)
  }
}

exports.postStaff = async (req, res, next) => {
  try {
    const restaurantId = req.userId;
    const fullName = req.body.fullName;
    const email = req.body.password;
    const password = await bcrypt.hash('root', 12);
    const staff = new Staff({
      fullName: fullName,
      email: email,
      password: password,
      restaurantId: restaurantId
    })
    const savedStaff = staff.save()
    res.status(201).json(savedStaff)
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    if (!err.message) err.message = 'Something Went Wrong';
    next(err)
  }
}