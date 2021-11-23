// 載入所需套件
const { User } = require('../models')
const helpers = require('../_helpers')
const userService = require('../services/userService')

const userController = {
  // 渲染註冊頁面
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  // 註冊
  signUp: (req, res) => {
    userService.signUp(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('/signup')
      }
      req.flash('success_messages', data.message)
      return res.redirect('/signin')
    })
  },

  // 渲染登入頁面
  signInPage: (req, res) => {
    return res.render('signin')
  },

  // 登入
  signIn: (req, res) => {
    req.flash('success_messages', '您已經成功登入！')
    res.redirect('/restaurants')
  },

  // 登出
  logout: (req, res) => {
    req.flash('success_messages', '您已經成功登出！')
    req.logout()
    res.redirect('/signin')
  },

  // 瀏覽使用者profile
  getUser: (req, res) => {
    userService.getUser(req, res, data => {
      return res.render('profile', data)
    })
  },

  // 渲染編輯使用者profile頁面
  editUser: async (req, res) => {
    try {
      // 登入的使用者id和req.params.若不相同(代表是修改id進入)，重新導回profile頁面，確保只有自己能修改自己的資料
      if (helpers.getUser(req).id !== Number(req.params.id)) {
        req.flash('error_messages', "無法變更他人Profile")
        res.redirect(`/users/${helpers.getUser(req).id}`)
      }
      const user = (await User.findByPk(req.params.id)).toJSON()
      return res.render('edit', { user })
    } catch (err) {
      return res.render('errorPage', { layout: false, error: err.message })
    }
  },

  // 修改使用者profile
  putUser: (req, res) => {
    userService.putUser(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      res.redirect(`/users/${helpers.getUser(req).id}`)
    })
  },

  // 添加餐廳收藏
  addFavorite: (req, res) => {
    userService.addFavorite(req, res, data => {
      if (data.status === 'success') {
        return res.redirect('back')
      }
    })
  },

  // 移除餐廳收藏
  removeFavorite: (req, res) => {
    userService.removeFavorite(req, res, data => {
      if (data.status === 'success') {
        return res.redirect('back')
      }
    })
  },

  // 新增喜歡餐廳
  addLike: (req, res) => {
    userService.addLike(req, res, data => {
      if (data.status === 'success') {
        return res.redirect('back')
      }
    })
  },

  // 移除喜歡餐廳
  removeLike: (req, res) => {
    userService.removeLike(req, res, data => {
      if (data.status === 'success') {
        return res.redirect('back')
      }
    })
  },

  // 瀏覽前10追蹤使用者
  getTopUser: (req, res) => {
    userService.getTopUser(req, res, data => {
      return res.render('topUser', data)
    })
  },

  // 新增追蹤
  addFollowing: (req, res) => {
    userService.addFollowing(req, res, data => {
      if (data.status === 'success') {
        return res.redirect('back')
      }
    })
  },

  // 移除追蹤
  removeFollowing: (req, res) => {
    userService.removeFollowing(req, res, data => {
      if (data.status === 'success') {
        return res.redirect('back')
      }
    })
  }
}

// userController export
module.exports = userController