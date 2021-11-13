// 載入所需套件
const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 10 // 每頁幾筆資料

const restController = {
  getRestaurants: (req, res) => {
    const whereQuery = {}
    let categoryId = ''
    offset = 0 // 從哪裡開始取資料
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    Restaurant.findAndCountAll({ raw: true, nest: true, include: [Category], where: whereQuery, offset, limit: pageLimit })
      .then(result => {
        // page相關參數
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(result.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, i) => i + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 < pages ? pages : page + 1

        // 處理餐廳資訊
        const restaurants = result.rows
        for (let restaurant of restaurants) {
          restaurant.description = restaurant.description.substring(0, 50)
          restaurant.categoryName = restaurant.Category.name
        }
        Category.findAll({ raw: true, nest: true })
          .then(categories => {
            return res.render('restaurants', { restaurants, categories, categoryId, page, totalPage, prev, next })
          })
      })
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, { include: [Category, { model: Comment, include: [User] }] })
      .then(restaurant => {
        return res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
  }
}
module.exports = restController