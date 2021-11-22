// 載入所需套件
const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let userController = {
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
    const token = jwt.sign(payload, process.env.JWT_SECRET)
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