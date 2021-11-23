// 載入所需套件
const { Restaurant, Category } = require('../models')
const adminService = require('../services/adminService')

const adminController = {
  // 後台瀏覽全部餐廳
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, data => {
      return res.render('admin/restaurants', data)
    })
  },

  // 渲染餐廳新增頁面
  createRestaurant: async (req, res) => {
    const categories = await Category.findAll({ raw: true, nest: true })
    return res.render('admin/create', { categories })
  },

  // 後台新增餐廳資料
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      res.redirect('/admin/restaurants')
    })
  },

  // 後台瀏覽單一餐廳
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, data => {
      return res.render('admin/restaurant', data)
    })
  },

  // 渲染餐廳編輯頁面
  editRestaurant: async (req, res) => {
    const categories = await Category.findAll({ raw: true, nest: true })
    const restaurant = (await Restaurant.findByPk(req.params.id)).toJSON()
    return res.render('admin/create', { categories, restaurant })
  },

  // 後台編輯餐廳資料
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      res.redirect('/admin/restaurants')
    })
  },

  // 後台刪除餐廳資料
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, data => {
      if (data.status === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },

  // 後台瀏覽全部使用者
  getUsers: (req, res) => {
    adminService.getUsers(req, res, data => {
      return res.render('admin/users', data)
    })
  },

  // 後台轉換使用者權限
  toggleAdmin: (req, res) => {
    adminService.toggleAdmin(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      return res.redirect('/admin/users')
    })
  }
}

module.exports = adminController