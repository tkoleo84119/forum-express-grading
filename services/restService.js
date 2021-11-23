// 載入所需套件
const { Category, Comment, Favorite, Restaurant, User } = require('../models')
const pageLimit = 10 // 每頁幾筆資料
const helpers = require('../_helpers')

const restService = {
  // 瀏覽餐廳首頁(全)
  getRestaurants: async (req, res, callback) => {
    try {
      const whereQuery = {}
      let categoryId = ''
      offset = 0 // 從哪裡開始取資料

      // 根據現在在第幾頁來決定要從哪裡開始取資料
      if (req.query.page) {
        offset = (req.query.page - 1) * pageLimit
      }
      // 如果有categoryId，代表有選特定類別，將其放進whereQuery，可以指定搜尋特定欄位特定值
      if (req.query.categoryId) {
        categoryId = Number(req.query.categoryId)
        whereQuery.CategoryId = categoryId
      }

      const result = await Restaurant.findAndCountAll({ raw: true, nest: true, include: [Category], where: whereQuery, offset, limit: pageLimit })
      // page相關參數
      const page = Number(req.query.page) || 1 // 沒有req.query.page代表在第一頁
      const pages = Math.ceil(result.count / pageLimit) // 利用result.count的值可以知道有幾筆餐廳資料，藉此得知要幾頁
      const totalPage = Array.from({ length: pages }).map((item, i) => i + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      // 處理餐廳資訊
      const restaurants = result.rows
      for (let restaurant of restaurants) {
        restaurant.description = restaurant.description.substring(0, 50)
        restaurant.categoryName = restaurant.Category.name
        restaurant.isFavorited = helpers.getUser(req).FavoritedRestaurants.filter(Favorite => Favorite.id === restaurant.id)
        restaurant.isLiked = helpers.getUser(req).LikedRestaurants.filter(Like => Like.id === restaurant.id)
      }
      const categories = await Category.findAll({ raw: true, nest: true })
      callback({ restaurants, categories, categoryId, page, totalPage, prev, next })
    } catch (err) {
      console.log(err)
    }
  },

  // 瀏覽特定餐廳
  getRestaurant: async (req, res, callback) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: [Category, { model: Comment, include: [User] }, { model: User, as: 'FavoritedUsers' }, { model: User, as: 'LikedUsers' }] })
      await restaurant.increment('viewCounts') // 自動為viewCounts增加1
      const isFavorited = restaurant.FavoritedUsers.filter(Favorite => Favorite.id === helpers.getUser(req).id)
      const isLiked = restaurant.LikedUsers.filter(Like => Like.id === helpers.getUser(req).id)
      callback({ restaurant: restaurant.toJSON(), isFavorited, isLiked })
    } catch (err) {
      console.log(err)
    }
  },

  // 瀏覽最新動態
  getFeeds: async (req, res, callback) => {
    try {
      const result = await Promise.all([
        Restaurant.findAll({
          limit: 10,
          raw: true,
          nest: true,
          order: [['createdAt', 'DESC']],
          include: [Category]
        }),
        Comment.findAll({
          limit: 10,
          raw: true,
          nest: true,
          order: [['createdAt', 'DESC']],
          include: [User, Restaurant]
        })
      ])
      callback({ restaurants: result[0], comments: result[1] })
    } catch (err) {
      console.log(err)
    }
  },

  // 瀏覽特定餐廳dashboard
  getDashBoard: async (req, res, callback) => {
    try {
      const restaurant = (await Restaurant.findByPk(req.params.id, { include: [Comment, Category, { model: User, as: 'FavoritedUsers' }] })).toJSON()
      callback({ restaurant })
    } catch (err) {
      console.log(err)
    }
  },

  // 瀏覽排名前10餐廳
  getTopRestaurant: async (req, res, callback) => {
    try {
      let restaurants = await Restaurant.findAll({ include: [{ model: User, as: 'FavoritedUsers' }] })
      restaurants = restaurants.map(restaurant => ({
        ...restaurant.dataValues,
        favoritedCount: restaurant.FavoritedUsers.length,
        description: restaurant.description.substring(0, 50),
        isFavorited: helpers.getUser(req).FavoritedRestaurants.filter(favorite => favorite.id === restaurant.id)
      }))
      restaurants = restaurants.sort((a, b) => b.FavoritedUsers.length - a.FavoritedUsers.length).slice(0, 10)
      callback({ restaurants })
    } catch (err) {
      console.log(err)
    }
  }
}

// restService export
module.exports = restService