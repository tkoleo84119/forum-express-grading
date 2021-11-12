// 載入所需套件
const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then(restaurants => {
        for (let restaurant of restaurants) {
          restaurant.description = restaurant.description.substring(0, 50),
          restaurant.categoryName = restaurant.Category.name
        }
        return res.render('restaurants', {restaurants})
      })
  }
}
module.exports = restController