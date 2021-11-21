// 載入所需套件
const db = require('../models')
const Category = db.Category
const categoryService = require('../services/categoryService')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, data => {
      return res.render('admin/categories', data)
    })
  },

  postCategories: (req, res) => {
    categoryService.postCategories(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      return res.redirect('/admin/categories')
    })
  },

  putCategory: (req, res) => {
    categoryService.putCategory(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      return res.redirect('/admin/categories')
    })
  },

  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, data => {
      if (data.status === 'success') {
        return res.redirect('/admin/categories')
      }
    })
  }
}

// categoryController export
module.exports = categoryController