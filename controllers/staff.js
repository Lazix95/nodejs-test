const Staff = require("./../models/staff");
const User = require("./../models/user");
const bcrypt = require("bcryptjs");

exports.getStaff = async (req, res, next) => {
  try {
    const userId = req.userId;
    const staff = await Staff.find({ restaurantId: userId });
    res.status(200).json(staff);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    if (!err.message) err.message = "Something Went Wrong";
    next(err);
  }
};

exports.postStaff = async (req, res, next) => {
  try {
    const restaurantId = req.userId;
    const fullName = req.body.fullName;
    const email = req.body.email;
    const user = await User.findById(req.userId);
    const restaurantName = user.restaurantName;
    const password = await bcrypt.hash("root", 12);
    
    const checkUser = await User.find({email:email})
    if(checkUser.length > 0) {
      const error = new Error('User with that email exists!')
      error.statusCode = 400
      throw error
    }
    const staff = new Staff({
      fullName: fullName,
      restaurantName: restaurantName,
      email: email,
      password: password,
      restaurantId: restaurantId
    });
    const savedStaff = await staff.save();
    res.status(201).json(savedStaff);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    if (!err.message) err.message = "Something Went Wrong";
    next(err);
  }
};

exports.putStaff = async (req, res, next) => {
  try {
    const staffId = req.params.id;
    const fullName = req.body.fullName;
    const email = req.body.email;
    const user = await User.find({email:email})
    if(user.length > 0) {
      const error = new Error('User with that email exists!')
      error.statusCode = 400
      throw error
    }
    staff = await Staff.findById(staffId)
    staff.email = email;
    staff.fullName = fullName;
    await staff.save()
    res.status(201).json(staff)
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    if (!err.message) err.message = "Something Went Wrong";
    next(err);
  }
};

exports.deleteStaff = async (req, res, next) => {
  try {
    const staffId = req.params.id;
    staff = await Staff.findById(staffId)
    await staff.remove()
    res.status(201).json({message: 'Staff deleted.'})
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    if (!err.message) err.message = "Something Went Wrong";
    next(err);
  }
}
