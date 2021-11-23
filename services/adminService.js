// 載入所需套件
const { Restaurant, Category, User } = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = {
  // 後台瀏覽全部餐廳
  getRestaurants: async (req, res, callback) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })
      callback({ restaurants })
    } catch (err) {
      console.log(err)
    }
  },

  // 後台瀏覽單一餐廳
  getRestaurant: async (req, res, callback) => {
    try {
      const restaurant = (await Restaurant.findByPk(req.params.id, { include: [Category] })).toJSON()
      callback({ restaurant })
    } catch (err) {
      console.log(err)
    }
  },

  // 後台新增餐廳資料
  postRestaurant: async (req, res, callback) => {
    try {
      if (!req.body.name) {
        return callback({ status: 'error', message: "name didn't exist" })
      }

      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID);
        imgur.upload(file.path, async (err, img) => {
          await Restaurant.create({
            ...req.body,
            image: file ? img.data.link : null,
            CategoryId: req.body.categoryId
          })
          callback({ status: 'success', message: 'restaurant was successfully created' })
        })
      }
      else {
        await Restaurant.create({
          ...req.body,
          image: null,
          CategoryId: req.body.categoryId
        })
        callback({ status: 'success', message: 'restaurant was successfully created' })
      }
    } catch (err) {
      console.log(err)
    }
  },

  // 後台編輯餐廳資料
  putRestaurant: async (req, res, callback) => {
    try {
      if (!req.body.name) {
        return callback({ status: 'error', message: "name didn't exist" })
      }

      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          const restaurant = await Restaurant.findByPk(req.params.id)
          await restaurant.update({
            ...req.body,
            image: file ? img.data.link : restaurant.image,
            CategoryId: req.body.categoryId
          })
          callback({ status: 'success', message: 'restaurant was successfully updated' })
        })
      } else {
        const restaurant = await Restaurant.findByPk(req.params.id)
        await restaurant.update({
          ...req.body,
          image: restaurant.image,
          CategoryId: req.body.categoryId
        })
        callback({ status: 'success', message: 'restaurant was successfully updated' })
      }
    } catch (err) {
      console.log(err)
    }
  },

  // 後台刪除餐廳資料
  deleteRestaurant: async (req, res, callback) => {
    try {
      await Restaurant.destroy({ where: { id: req.params.id } })
      callback({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
    }
  },

  // 後台瀏覽全部使用者
  getUsers: async (req, res, callback) => {
    try {
      const users = await User.findAll({ raw: true, nest: true })
      callback({ users })
    } catch (err) {
      console.log(err)
    }
  },

  // 後台轉換使用者權限
  toggleAdmin: async (req, res, callback) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (user.email === 'root@example.com') {
        return callback({ status: 'error', message: '禁止變更管理者權限' })
      }
      const isAdmin = !user.isAdmin
      await user.update({ isAdmin })
      callback({ status: 'success', message: '使用者權限變更成功' })
    } catch (err) {
      console.log(err)
    }
  }
}

// adminService exports
module.exports = adminService