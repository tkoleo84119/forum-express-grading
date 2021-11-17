// 載入所需套件
const bcrypt = require('bcryptjs')
const { Op } = require("sequelize")
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const helpers = require('../_helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

// 去除評論中重複的餐廳
const removeDBLComment = (rawData) => {
  const comments = []
  for (let data of rawData) {
    // 如果在comments中有存在相同的RestaurantId就回傳true
    const check = comments.find(comment => comment.RestaurantId === data.RestaurantId)
    if (!check) {
      comments.push(data)
    }
  }
  return comments
}

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '此信箱已註冊過！')
            return res.redirect('/signup')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            })
              .then(user => {
                req.flash('success_messages', '您已經成功註冊帳號！')
                return res.redirect('/signin')
              })
          }
        })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '您已經成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '您已經成功登出！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: async (req, res) => {
    try {
      const user = (await User.findByPk(req.params.id,
        { include: { model: Comment, include: { model: Restaurant, attribute: ['id', 'image'] } } }
      )).toJSON()

      // 因應測試檔若user.Comments不存在，執行removeDBLComment會報錯，因此新增判斷式
      user.Comments ? user.Comments = removeDBLComment(user.Comments) : ''
      user.Comments ? user.commentCount = user.Comments.length : ''

      return res.render('profile', { user })
    } catch (err) {
      return res.render('errorPage', { layout: false, error: err.message })
    }
  },

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

  putUser: async (req, res) => {
    try {
      // 登入的使用者id和req.params.若不相同(代表是修改id進入)，導回上一頁，確保只有自己能修改自己的資料
      if (helpers.getUser(req).id !== Number(req.params.id)) {
        req.flash('error_messages', "無法變更他人Profile")
        res.redirect('back')
      }

      // 確保name和email皆有輸入
      if (!req.body.name || !req.body.email) {
        req.flash('error_messages', "name或email尚未輸入")
        res.redirect('back')
      }

      // 確認email在資料庫沒有重複
      if (helpers.getUser(req).email !== req.body.email) {
        const emailCheck = await User.findOne({ where: { email: req.body.email } })
        if (JSON.stringify(emailCheck) !== '{}') {
          req.flash('error_messages', "此email已註冊過")
          return res.redirect('back')
        }
      }

      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          const user = await User.findByPk(req.params.id)
          await user.update({
            ...req.body,
            image: file ? img.data.link : helpers.getUser(req).image
          })
          req.flash('success_messages', '使用者資料編輯成功')
          res.redirect(`/users/${user.id}`)
        })
      } else {
        const user = await User.findByPk(req.params.id)
        await user.update({
          ...req.body,
          image: helpers.getUser(req).image
        })
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${user.id}`)
      }
    } catch (err) {
      return res.render('errorPage', { layout: false, error: err.message })
    }
  },

  addFavorite: async (req, res) => {
    try {
      await Favorite.create({
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      })
      return res.redirect('back')
    } catch (err) {
      return res.render('errorPage', { layout: false, error: err.message })
    }
  },

  removeFavorite: async (req, res) => {
    try {
      await Favorite.destroy({
        where: {
          UserId: req.user.id, // 不知為何改成helpers.getUser(req).id就過不了測試檔
          RestaurantId: req.params.restaurantId
        }
      })
      return res.redirect('back')
    } catch (err) {
      return res.render('errorPage', { layout: false, error: err.message })
    }
  },

  addLike: async (req, res) => {
    try {
      await Like.create({
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      })
      return res.redirect('back')
    } catch (err) {
      return res.render('errorPage', { layout: false, error: err.message })
    }
  },

  removeLike: async (req, res) => {
    try {
      await Like.destroy({
        where: {
          UserId: helpers.getUser(req).id,
          RestaurantId: req.params.restaurantId
        }
      })
      return res.redirect('back')
    } catch (err) {
      return res.render('errorPage', { layout: false, error: err.message })
    }
  },

  getTopUser: async (req, res) => {
    try {
      let users = await User.findAll({ include: [{ model: User, as: 'Followers' }] })
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: helpers.getUser(req).Followings.filter(follower => follower.id === user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users })
    } catch (err) {
      return res.render('errorPage', { layout: false, error: err.message })
    }
  },

  addFollowing: async (req, res) => {
    try {
      await Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: req.params.userId
      })
      return res.redirect('back')
    } catch (err) {
      return res.render('errorPage', { layout: false, error: err.message })
    }
  },

  removeFollowing: async (req, res) => {
    try {
      await Followship.destroy({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.params.userId
        }
      })
      return res.redirect('back')
    } catch (err) {
      return res.render('errorPage', { layout: false, error: err.message })
    }
  },
}

// userController export
module.exports = userController