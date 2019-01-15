const   router = require('express').Router(),
        passport = require('passport'),
        User = require('../models/user'),
        admin = require('../middlewares/admin_session'),
        session_active = require('../middlewares/session_active')

router.get('/login', async (req, res) => {
    let { user } = req.session

    if (!user){
        res.render('users/login')
    }else{
        res.redirect('/n/list')
    }
})

router.post('/login', passport.authenticate('local-users-login', {
    //successRedirect: '/n/list',
    successRedirect: '/n/list',
    failureRedirect: '/u/login',
    failureFlash: true
}))


router.get('/logout', session_active, (req, res) => {
    req.logout()
    res.redirect('/u/login')
})

router.get('/new', admin, async (req, res) => {
    res.render('users/new', {user: req.session.user, messages: {type:0, message:""} })
})

router.post('/new', admin, async (req, res) => {
    let { username } = req.body,
        { name } = req.body,
        { last_name } = req.body,
        { password } = req.body,
        { confirm_password } = req.body,
        { type } = req.body
     
    if (password !== confirm_password){
        res.render('users/new', { 
            user: req.session.user,
            messages: {type:1, message:"Las contraseñas no coinciden.", username, name, last_name, utype:type} 
        })
        return
    } 
        
    if (await User.findOne({username})) {
        res.render('users/new', { 
            user: req.session.user,
            messages: {type:1, message:"Ya existe un usuario con ese nombre.", username, name, last_name, utype:type} 
        })
        return
    }

    let newUser = new User({username, name, last_name, type:Number(type)})
    newUser.password = newUser.encryptPassword(password)
    await newUser.save()

    res.render('users/new', { 
        user: req.session.user,
        messages: {type:2, message:"Se creo el usuario exitosamente."} 
    })
})

router.get('/list', admin, async (req, res) => {
    res.render('users/list', {user:req.session.user, users: await User.find({}) })
})

router.get('/edit/:username', admin, async (req, res) => {
    let { username } = req.params
    if(user_edit = await User.findOne({username})){
        res.render('users/edit', {user:req.session.user, user_edit, messages:{type:0, message:""}})        
        return
    }
    res.redirect('/u/list')
})

router.post('/edit/:username', admin, async (req, res) => {
    let { id } = req.body,
        { name } = req.body,
        { last_name } = req.body,
        { password } = req.body,
        { confirm_password } = req.body
    
        user_edit = await User.findById(id)

    if (password !== confirm_password){
        res.render('users/edit', { 
            user_edit, messages: {type:1, message:"Las contraseñas no coinciden."} 
        })
        return
    } 

    if(password == ''){
        await User.findByIdAndUpdate(id, {name, last_name})    
    }else{
        let password_encrypted = user_edit.encryptPassword(password)
        await User.findByIdAndUpdate(id, {name, last_name, password: password_encrypted})
    }

    res.redirect('/u/list')
})

router.get('/delete/:username', admin, async (req, res) => {
    let { username } = req.params

    const user = await User.findOne({username})
    if(!user){
        res.redirect('/u/list')
        return
    }
    await User.findByIdAndDelete(user._id)
    res.redirect('/u/list')
})

router.get("/my-profile", session_active, (req, res) => {
    let {user} = req.session,
        url = user.type > 0 ? 'users/change_password_admin' : 'users/change_password_author'
    res.render(url, {user, messages: {type:0, message:""}})
})

router.post("/my-profile", session_active, async (req, res) => {
    let {user} = req.session,
        {password_old} = req.body,
        {password_new1} = req.body,
        {password_new2} = req.body,
        url = user.type > 0 ? 'users/change_password_admin' : 'users/change_password_author'

    if (password_new1 !== password_new2){
        res.render(url, {user, messages: {type:1, message: "Las contraseñas no coinciden."}})
        return
    }

    if (!user.comparePassword(password_old, user.password)){
        res.render(url, {user, messages: {type:1, message: "La contraseña actual es incorrecta."}})
        return
    }

    let password = user.encryptPassword(password_new1)
    await User.findByIdAndUpdate(user._id, {password})
    req.session.user.password = password

    res.render(url, {user: req.session.user, messages: {type:2, message: "La contraseña se cambio correctamente."}})
})


module.exports = router