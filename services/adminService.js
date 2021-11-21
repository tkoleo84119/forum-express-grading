// 載入所需套件
const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = {
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

  getRestaurant: async (req, res, callback) => {
    try {
      const restaurant = (await Restaurant.findByPk(req.params.id, { include: [Category] })).toJSON()
      callback({ restaurant })
    } catch (err) {
      console.log(err)
    }
  },

  deleteRestaurant: async (req, res, callback) => {
    try {
      await Restaurant.destroy({ where: { id: req.params.id } })
      callback({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
    }
  },
}

// adminService exports
module.exports = adminService