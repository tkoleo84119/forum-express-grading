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

  postRestaurant: async (req, res, callback) => {
    try {
      if (!req.body.name) {
        callback({ status: 'error', message: "name didn't exist" })
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

  putRestaurant: async (req, res, callback) => {
    try {
      if (!req.body.name) {
        callback({ status: 'error', message: "name didn't exist" })
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