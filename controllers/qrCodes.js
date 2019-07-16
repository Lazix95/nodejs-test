const QRcodes = require('./../models/QRcode');
const pricing = require('./../utils/pricingPackage');

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
      const qrCodes = await QRcodes.find({user:userId});
      const numberOfCodes = qrCodes.length;
      const qrCodesToSet = [];
      let qrCodesToDelete = null

      if(userId && numberOfCodes < planToSet) {
         for (let i = numberOfCodes; i < planToSet; i++) {
            const qrCode = {
               user: userId,
               tableNumber: i + 1
            };
            qrCodesToSet.push(qrCode)
         }
       await QRcodes.insertMany(qrCodesToSet);
      } else if(userId && numberOfCodes > planToSet) {
         qrCodesToDelete = await QRcodes.find({user:userId}).skip(planToSet)
      }
      const qrCodes2 = await QRcodes.find({user:userId});
      res.status(200).json({qrCodes2, planToSet: planToSet, qrCodesToDelete})
   } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      if (!err.message) err.message = 'Something Went Wrong';
      next(err)
   }
};