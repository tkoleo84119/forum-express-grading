// 載入所需套件
const restService = require('../../services/restService')

const restController = {
  // 瀏覽餐廳首頁(全)
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, data => {
      return res.json(data)
    })
  },

  // 瀏覽特定餐廳
  getRestaurant: (req, res) => {
    restService.getRestaurant(req, res, data => {
      return res.json(data)
    })
  },

  // 瀏覽最新動態
  getFeeds: (req, res) => {
    restService.getFeeds(req, res, data => {
      return res.json(data)
    })
  },

  // 瀏覽特定餐廳dashboard
  getDashBoard: (req, res) => {
    restService.getDashBoard(req, res, data => {
      return res.json(data)
    })
  },

  // 瀏覽排名前10餐廳
  getTopRestaurant: (req, res) => {
    restService.getTopRestaurant(req, res, data => {
      return res.json(data)
    })
  }
}

// restController exports
module.exports = restController