const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminController = {
  getRestaurants: async (req, res) => {
    const restaurants = await Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
    return res.json({ restaurants })
  },
}

// adminController exports
module.exports = adminController