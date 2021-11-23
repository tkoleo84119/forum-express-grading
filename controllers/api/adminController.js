// 載入所需套件
const adminService = require('../../services/adminService')

const adminController = {
  // 後台瀏覽全部餐廳
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, data => {
      return res.json(data)
    })
  },

  // 後台瀏覽單一餐廳
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, data => {
      return res.json(data)
    })
  },

  // 後台新增餐廳資料
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, data => {
      return res.json(data)
    })
  },

  // 後台編輯餐廳資料
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, data => {
      return res.json(data)
    })
  },

  // 後台刪除餐廳資料
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, data => {
      return res.json(data)
    })
  },

  // 後台瀏覽全部使用者
  getUsers: (req, res) => {
    adminService.getUsers(req, res, data => {
      return res.json(data)
    })
  },

  // 後台轉換使用者權限
  toggleAdmin: (req, res) => {
    adminService.toggleAdmin(req, res, data => {
      return res.json(data)
    })
  }
}

// adminController exports
module.exports = adminController