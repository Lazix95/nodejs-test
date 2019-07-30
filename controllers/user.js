const User = require('./../models/user');
const Staff = require('./../models/staff');
const bcrypt = require('bcryptjs');

exports.getUser = async (req, res, next) => {
  try {
   let user = await User.findById(req.userId).select('fullName restaurantName _id email, pricingPackage');
      if(!user){
        user = await Staff.findById(req.userId).select('fullName _id email staff restaurantId').populate({path: 'restaurantId', select:'restaurantName'});
        user.restaurantName = user.restaurantId.restaurantName
        user.restaurantId = user.restaurantId._id
        console.log('staff => ',user)
      }
      if (!user) {
         throw new Error('User Not Found!');
      }
      res.status(200).json(user)
  } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      if (!err.message) err.message = 'Something Went Wrong';
      next(err)
  }
};

exports.putUser = async (req, res, next) => {
   try {
      const userId = req.userId;
      const fullName = req.body.fullName;
      const restaurantName = req.body.restaurantName;
      const email = req.body.email;
      const staff = req.body.staff;
      const newPassword = req.body.newPassword;
      const currentPassword = req.body.currentPassword
      const hashedPassword = newPassword ? await bcrypt.hash(newPassword, 12) : null;

      const user = staff ? await Staff.findById(userId) : await User.findById(userId);
      const isEqual = currentPassword ? await bcrypt.compare(currentPassword, user.password) : false
      if(currentPassword && !isEqual) {
         const error = new Error('Current password is not correct')
         error.statusCode = 400
         throw error
      }
      user.fullName = fullName ? fullName : user.fullName;
      user.restaurantName = restaurantName ? restaurantName : user.restaurantName;
      user.email = email ? email : user.email;
      user.password = isEqual ? hashedPassword ? hashedPassword: user.password : user.password;
      const savedUser = await user.save();
      const userData = {
         restaurant_id: savedUser._id.toString(),
         fullName: savedUser.fullName,
         restaurantName: savedUser.restaurantName,
         email: savedUser.email
      };
      res.status(201).json(userData)
   } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      if (!err.message) err.message = 'Something Went Wrong';
      next(err)
   }
};