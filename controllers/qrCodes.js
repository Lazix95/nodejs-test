const QRcodes = require('./../models/QRcode');
const pricing = require('./../utils/pricingPackage');
const User = require('./../models/user')

exports.getQRcodes = async (req, res, next) => {
   try {
      const qrCodes = await QRcodes.find({user: req.userId});
      res.status(200).json(qrCodes)
   } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      if (!err.message) err.message = 'Something Went Wrong';
      next(err)
   }
};

exports.putQRcodes = async (req, res, next) => {
   try {
      const qrCodeId = req.params.id;
      const userId = req.userId;
      const tableNumber = req.body.tableNumber;
      const code = await QRcodes.findOne({user: userId, _id: qrCodeId});
      code.tableNumber = tableNumber ? tableNumber : code.tableNumber;
      const savedCode = await code.save()
      res.status(202).json(savedCode);
   } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      if (!err.message) err.message = 'Something Went Wrong';
      next(err)
   }
};

exports.patchPricingPlan = async (req, res, next) => {
   try {
      const userId = req.userId;
      const pricingPlan = req.body.pricingPlan;
      const planToSet = pricing.pricingPackage(parseInt(pricingPlan));
      const user = await User.findById(userId);
      const qrCodes = await QRcodes.find({user:userId});
      const numberOfCodes = qrCodes.length;
      const qrCodesToSet = [];
      let qrCodesToDelete = null

      if(!user) {
         const error = new Error('User not found!')
         error.statusCode = 400;
         throw error
      }

      if(userId && numberOfCodes < planToSet) {
         for (let i = numberOfCodes; i < planToSet; i++) {
            const qrCode = {
               user: userId,
               tableNumber: i + 1,
               qrCodeNumber: i + 1
            };
            qrCodesToSet.push(qrCode)
         }
        await QRcodes.insertMany(qrCodesToSet);
      } else if(userId && numberOfCodes > planToSet) {
        await QRcodes.deleteMany({user: userId, "qrCodeNumber" : { $gt : planToSet } })
      }
      user.pricingPackage = parseInt(pricingPlan);
      await user.save()
      const qrCodes2 = await QRcodes.find({user:userId});
      res.status(200).json({qrCodes: qrCodes2, pricingPackage: pricingPlan})
   } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      if (!err.message) err.message = 'Something Went Wrong';
      next(err)
   }
};