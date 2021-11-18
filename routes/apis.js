// 載入所需套件
const express = require('express')
const router = express.Router()
const adminController = require('../controllers/api/adminController')

// admin routes setting
router.get('/admin/restaurants', adminController.getRestaurants)

// router exports
module.exports = router