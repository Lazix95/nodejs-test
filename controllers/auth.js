const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pricing = require('./../utils/pricingPackage');

const User = require('../models/user');
const Staff = require('./../models/staff')
const QRcode = require('./../models/QRcode');


exports.signup = async (req, res, next) => {
   try {
      const email = req.body.email;
      const fullName = req.body.fullName;
      const password = req.body.password;
      const restaurantName = req.body.restaurantName;
      const pricingPackage = req.body.pricingPackage;
      const hashedPw = await bcrypt.hash(password, 12);
      const qrCodes = [];


      const user = new User({email, password: hashedPw, fullName, restaurantName});
      const saveUser = await user.save();

      if(saveUser._id) {
         for (let i = 0; i < pricing.pricingPackage(parseInt(pricingPackage)); i++) {
            const qrCode = {
               user: saveUser._id,
               tableNumber: i + 1
            };
            qrCodes.push(qrCode)
         }
         QRcode.insertMany(qrCodes);
         next()
      }
   } catch (err) {
      if (!err.statusCode) {
         err.statusCode = 500
      }
      next(err)
   }
};

exports.login = async (req, res, next) => {
   try {
      const tokenExpiresIn = 3600; // Time in seconds!
      const email = req.body.email;
      const password = req.body.password;
      let user = await User.findOne({email: email});

      if(!user){
         user = await Staff.findOne({email: email})
      }

      if (!user) {
         const error = new Error('A user with this email is not found');
         error.statusCode = 401;
         throw error;
      }
      const isEqual = await bcrypt.compare(password, user.password);

      if (!isEqual) {
         const error = new Error('Wrong Password');
         error.statusCode = 401;
         throw error;
      }

      const token = jwt.sign({
         email: user.email,
         userId: user._id.toString(),
         restaurantId:  user.staff ? user.restaurantId.toString() : user._id.toString(),
      }, 'SuperSecretCode', {expiresIn: tokenExpiresIn + 's'});

      const userData = {
         restaurant_id:  user.staff ? restaurantId : user._id.toString(),
         fullName: user.fullName,
         restaurantName: user.restaurantName,
         email: user.email
      };
      const staff = user.staff ? user.staff : ''
      res.status(200).json({token: token, expires:tokenExpiresIn, staff: staff, userData: userData})
   } catch (err) {
      if (!err.statusCode) {
         err.statusCode = 500
      }
      next(err)
   }
};