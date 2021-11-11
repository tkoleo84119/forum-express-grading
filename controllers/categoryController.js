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
  },

  postCategories: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '輸入分類不存在')
      return res.redirect('back')
    } else {
      Category.create({ name: req.body.name })
        .then(category => {
          res.redirect('/admin/categories')
        })
    }
  },
}

// categoryController export
module.exports = categoryController