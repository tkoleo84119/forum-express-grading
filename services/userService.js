// 載入所需套件
const bcrypt = require('bcryptjs')
const { Comment, Favorite, Followship, Like, Restaurant, User } = require('../models')
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

const userService = {
  // 註冊
  signUp: async (req, res, callback) => {
    try {
      if (req.body.passwordCheck !== req.body.password) {
        return callback({ status: 'error', message: '兩次密碼輸入不同！' })
      } else {
        const user = await User.findOne({ where: { email: req.body.email } })
        if (user) {
          return callback({ status: 'error', message: '此信箱已註冊過！' })
        } else {
          await User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          })
          callback({ status: 'success', message: '成功註冊帳號！' })
        }
      }
    } catch (err) {
      console.log(err)
    }
  },

  // 瀏覽使用者profile
  getUser: async (req, res, callback) => {
    try {
      const user = (await User.findByPk(req.params.id,
        {
          include: [
            { model: Comment, include: { model: Restaurant, attribute: ['id', 'image'] } },
            { model: User, as: 'Followings' },
            { model: User, as: 'Followers' },
            { model: Restaurant, as: 'FavoritedRestaurants' }
          ]
        }
      )).toJSON()

      if (user.Comments) {
        user.Comments = removeDBLComment(user.Comments)
      }
      callback({ user })
    } catch (err) {
      console.log(err)
    }
  },

  // 修改使用者profile
  putUser: async (req, res, callback) => {
    try {
      // 登入的使用者id和req.params.若不相同(代表是修改id進入)，導回上一頁，確保只有自己能修改自己的資料
      if (helpers.getUser(req).id !== Number(req.params.id)) {
        return callback({ status: 'error', message: '無法變更他人Profile' })
      }

      // 確保name和email皆有輸入
      if (!req.body.name || !req.body.email) {
        return callback({ status: 'error', message: 'name或email尚未輸入' })
      }

      // 確認email在資料庫沒有重複
      if (helpers.getUser(req).email !== req.body.email) {
        const emailCheck = await User.findOne({ where: { email: req.body.email } })
        if (JSON.stringify(emailCheck) !== '{}') {
          return callback({ status: 'error', message: '此email已註冊過' })
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
          callback({ status: 'success', message: '使用者資料編輯成功' })
        })
      } else {
        const user = await User.findByPk(req.params.id)
        await user.update({
          ...req.body,
          image: helpers.getUser(req).image
        })
        callback({ status: 'success', message: '使用者資料編輯成功' })
      }
    } catch (err) {
      console.log(err)
    }
  },

  // 添加餐廳收藏
  addFavorite: async (req, res, callback) => {
    try {
      await Favorite.create({
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      })
      callback({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
    }
  },

  // 移除餐廳收藏
  removeFavorite: async (req, res, callback) => {
    try {
      await Favorite.destroy({
        where: {
          UserId: req.user.id, // 不知為何改成helpers.getUser(req).id就過不了測試檔
          RestaurantId: req.params.restaurantId
        }
      })
      callback({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
    }
  },

  // 新增喜歡餐廳
  addLike: async (req, res, callback) => {
    try {
      await Like.create({
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      })
      callback({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
    }
  },

  // 移除喜歡餐廳
  removeLike: async (req, res, callback) => {
    try {
      await Like.destroy({
        where: {
          UserId: helpers.getUser(req).id,
          RestaurantId: req.params.restaurantId
        }
      })
      callback({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
    }
  },

  // 前10追蹤者數量的使用者
  getTopUser: async (req, res, callback) => {
    try {
      let users = await User.findAll({ include: [{ model: User, as: 'Followers' }] })
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: helpers.getUser(req).Followings.filter(follower => follower.id === user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      callback({ users })
    } catch (err) {
      console.log(err)
    }
  },

  // 新增追蹤
  addFollowing: async (req, res, callback) => {
    try {
      await Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: req.params.userId
      })
      callback({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
    }
  },

  // 移除追蹤
  removeFollowing: async (req, res, callback) => {
    try {
      await Followship.destroy({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.params.userId
        }
      })
      callback({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
    }
  }
}

// userService exports
module.exports = userService