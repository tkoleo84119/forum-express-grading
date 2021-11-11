// 載入所需套件
const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      res.render('admin/categories', { categories })
    })
  }
}

// categoryController export
module.exports = categoryController