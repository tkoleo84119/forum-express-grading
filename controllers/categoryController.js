// 載入所需套件
const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then(category => {
            return res.render('admin/categories', { categories, category: category.toJSON() })
          })
      } else {
        return res.render('admin/categories', { categories })
      }
    })
  },

  postCategories: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '未輸入分類名稱')
      return res.redirect('back')
    } else {
      Category.create({ name: req.body.name })
        .then(category => {
          res.redirect('/admin/categories')
        })
    }
  },

  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '未輸入分類名稱')
      return res.redirect('back')
    } else {
      Category.findByPk(req.params.id)
        .then(category => {
          category.update(req.body)
            .then(category => {
              res.redirect('/admin/categories')
            })
        })
    }
  },
}

// categoryController export
module.exports = categoryController