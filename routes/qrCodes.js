const expess = require('express');
const router = expess.Router();

const isAuth = require('./../middleware/is-auth');
const qrController = require('./../controllers/qrCodes');

router.get('/qrcodes', isAuth, qrController.getQRcodes);

router.put('/qrcodes/:id', isAuth, qrController.putQRcodes);

router.patch('/qrcodes', isAuth, qrController.patchPricingPlan);

module.exports = router;