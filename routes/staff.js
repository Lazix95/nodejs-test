const express = require('express');
const router = express.Router()
const isAuth = require('./../middleware/is-auth');

router.get('/staff', isAuth)

router.post('/staff', isAuth)

router.put('/staff',isAuth)

router.delete('/staff', isAuth)

module.exports = router