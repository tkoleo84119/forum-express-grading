if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 載入所需套件
const express = require('express')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const helpers = require('./_helpers')
const session = require('express-session')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const app = express()
const PORT = process.env.PORT

// 套件相關settings
app.engine('hbs', handlebars({ defaultLayout: 'main', extname: '.hbs', helpers: require('./config/handlebars-helpers') }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use('/upload', express.static(__dirname + '/upload'))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.loginUser = helpers.getUser(req)
  next()
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})

require('./routes')(app, passport)

module.exports = app
