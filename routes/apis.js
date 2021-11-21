// 載入所需套件
const express = require('express')
const router = express.Router()
const adminController = require('../controllers/api/adminController')
const categoryController = require('../controllers/api/categoryController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// admin routes setting
router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurants/:id', adminController.getRestaurant)
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

// category routes setting
router.get('/admin/categories', categoryController.getCategories)
router.get('/admin/categories/:id', categoryController.getCategories)

// router exports
module.exports = router