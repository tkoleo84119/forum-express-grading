// 載入所需套件
const bcrypt = require('bcryptjs')
const { User } = require('../../models')
const jwt = require('jsonwebtoken')
const userService = require('../../services/userService')

let userController = {
  // 註冊
  signUp: (req, res) => {
    userService.signUp(req, res, data => {
      return res.json(data)
    })
  },

  // 登入
  signIn: async (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }

    let username = req.body.email
    let password = req.body.password
    const user = await User.findOne({ where: { email: username } })

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'no such user found' })
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ status: 'error', message: 'passwords did not match' })
    }

    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1m' }) // expiresIn自動在payload中新增exp(Token多久過期)
    return res.json({
      status: 'success',
      message: 'ok',
      token: token,
      user: {
        id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin
      }
    })
  },

  // 瀏覽使用者profile
  getUser: (req, res) => {
    userService.getUser(req, res, data => {
      return res.json(data)
    })
  },

  // 修改使用者profile
  putUser: (req, res) => {
    userService.putUser(req, res, data => {
      return res.json(data)
    })
  },

  // 添加餐廳收藏
  addFavorite: (req, res) => {
    userService.addFavorite(req, res, data => {
      return res.json(data)
    })
  },

  // 移除餐廳收藏
  removeFavorite: (req, res) => {
    userService.removeFavorite(req, res, data => {
      return res.json(data)
    })
  },

  // 新增喜歡餐廳
  addLike: (req, res) => {
    userService.addLike(req, res, data => {
      return res.json(data)
    })
  },

  // 移除喜歡餐廳
  removeLike: (req, res) => {
    userService.removeLike(req, res, data => {
      return res.json(data)
    })
  },

  // 瀏覽前10追蹤使用者
  getTopUser: (req, res) => {
    userService.getTopUser(req, res, data => {
      return res.json(data)
    })
  },

  // 新增追蹤
  addFollowing: (req, res) => {
    userService.addFollowing(req, res, data => {
      return res.json(data)
    })
  },

  // 移除追蹤
  removeFollowing: (req, res) => {
    userService.removeFollowing(req, res, data => {
      return res.json(data)
    })
  }
}

// userController exports
module.exports = userController