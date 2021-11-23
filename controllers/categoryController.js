// 載入所需套件
const categoryService = require('../services/categoryService')

const categoryController = {
  // 後台瀏覽全部餐廳分類
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, data => {
      return res.render('admin/categories', data)
    })
  },

  // 後台新增餐廳分類
  postCategories: (req, res) => {
    categoryService.postCategories(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      return res.redirect('/admin/categories')
    })
  },

  // 後台修改餐廳分類
  putCategory: (req, res) => {
    categoryService.putCategory(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      return res.redirect('/admin/categories')
    })
  },

  // 後台刪除餐廳分類
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