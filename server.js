const   express = require('express'),
        path = require('path'),
        flash = require('connect-flash'),
        session = require('express-session'),
        passport = require('passport'),
        uuid = require('uuid/v4'),
        multer = require('multer')

// initializations
const   app = express()

require('./database')
require('./passport/local-auth')
// settings
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
// middlewares
app.use(express.urlencoded({ extended:false}))
app.use(session({
    secret: 'unison-news',
    resave: false,
    saveUninitialized: true
}))

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
   app.locals.loginMessage = req.flash('loginMessage')
    app.locals.user = req.user
   req.session.user = req.user
    next()
})

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb, filename) => {
        cb(null, uuid() + path.extname(file.originalname));
    }
}) 
app.use(multer({storage}).single('image'));

// staticfiles
app.use('/public', express.static('public') )
// routes
app.use('/u', require('./routes/user'))
app.use('/d', require('./routes/department'))
app.use('/n', require('./routes/news'))
// error 404
app.use(function(req, res, next) {
    res.redirect("/u/login")
})

// server
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`)
})