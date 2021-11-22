// 載入所需套件
const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User
const jwt = require('jsonwebtoken')

let userController = {
  signUp: async (req, res) => {

    if (req.body.passwordCheck !== req.body.password) {
      return res.json({ status: 'error', message: '兩次密碼輸入不同！' })
    } else {
      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) {
        return res.json({ status: 'error', message: '此信箱已註冊過！' })
      } else {
        await User.create({
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
        })
        return res.json({ status: 'success', message: '成功註冊帳號！' })
      }
    }
  },

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
}

// userController exports
module.exports = userController