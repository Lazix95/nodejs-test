const expess = require('express');
const router = expess.Router();

const isAuth = require('./../middleware/is-auth');
const userController = require('./../controllers/user');

router.get('/user', isAuth, userController.getUser);
router.put('/user', isAuth, userController.putUser);

module.exports = router;