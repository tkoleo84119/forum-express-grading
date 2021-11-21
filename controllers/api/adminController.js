// 載入所需套件
const adminService = require('../../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, data => {
      return res.json(data)
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, data => {
      return res.json(data)
    })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, data => {
      return res.json(data)
    })
  },
}

// adminController exports
module.exports = adminController