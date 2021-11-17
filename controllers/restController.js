// 載入所需套件
const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const Favorite = db.Favorite
const pageLimit = 10 // 每頁幾筆資料
const helpers = require('../_helpers')

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
          restaurant.isFavorited = helpers.getUser(req).FavoritedRestaurants.filter(Favorite => Favorite.id === restaurant.id)
          restaurant.isLiked = helpers.getUser(req).LikedRestaurants.filter(Like => Like.id === restaurant.id)
        }
        Category.findAll({ raw: true, nest: true })
          .then(categories => {
            return res.render('restaurants', { restaurants, categories, categoryId, page, totalPage, prev, next })
          })
      })
  },

  getRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: [Category, { model: Comment, include: [User] }, { model: User, as: 'FavoritedUsers' }, { model: User, as: 'LikedUsers' }] })
      await restaurant.increment('viewCounts') // 自動為viewCounts增加1
      const isFavorited = restaurant.FavoritedUsers.filter(Favorite => Favorite.id === helpers.getUser(req).id)
      const isLiked = restaurant.LikedUsers.filter(Like => Like.id === helpers.getUser(req).id)
      return res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
    } catch (err) {
      return res.render('errorPage', { layout: false, error: err.message })
    }
  },

  getFeeds: (req, res) => {
    return Promise.all([
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
    ]).then(([restaurants, comments]) => {
      return res.render('feeds', {
        restaurants: restaurants,
        comments: comments
      })
    })
  },

  getDashBoard: async (req, res) => {
    try {
      const restaurant = (await Restaurant.findByPk(req.params.id, { include: [Comment, Category, { model: User, as: 'FavoritedUsers' }] })).toJSON()

      // 由於測試檔未有comment，在找不到restaurant.Comments的情況下會報錯，因此添加判斷式來避免此情況
      restaurant.Comments ? restaurant.commentCount = restaurant.Comments.length : ''
      restaurant.FavoritedUsers ? restaurant.favoriteCount = restaurant.FavoritedUsers.length : ''

      res.render('dashboard', { restaurant })
    } catch (err) {
      return res.render('errorPage', { layout: false, error: err.message })
    }
  },

  getTopRestaurant: async (req, res) => {
    try {
      let restaurants = await Restaurant.findAll({ include: [{ model: User, as: 'FavoritedUsers' }] })
      restaurants = restaurants.map(restaurant => ({
        ...restaurant.dataValues,
        favoritedCount: restaurant.FavoritedUsers.length,
        description: restaurant.description.substring(0, 50),
        isFavorited: helpers.getUser(req).FavoritedRestaurants.filter(favorite => favorite.id === restaurant.id)
      }))
      restaurants = restaurants.sort((a, b) => b.FavoritedUsers.length - a.FavoritedUsers.length).slice(0,10)
      return res.render('topRestaurant', { restaurants })
    } catch (err) {
      return res.render('errorPage', { layout: false, error: err.message })
    }
  },
  
}

module.exports = restController