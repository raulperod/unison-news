const   router = require('express').Router(),
        News = require('../models/news'),
        Department = require('../models/department'),
        Image = require('../models/image')
        session_active = require('../middlewares/session_active'),
        moment = require('moment')

router.get('/new', session_active, async (req, res) => {
    let { user } = req.session,
        url = user.type > 0 ? 'news/new_admin' : 'news/new_author'

    res.render(url, {user, departments: await Department.find({}), messages: {type:0, message:""} })
})

router.post('/new', session_active, async (req, res) => {
    let { user } = req.session,
        { title } = req.body,
        { department_name } = req.body,
        { body } = req.body,
        { url } = req.body,
        { start_date } = req.body,
        { finish_date } = req.body,
        urlv = user.type > 0 ? 'news/new_admin' : 'news/new_author'
        
    // string to date
    start_date = moment(start_date).toDate()
    finish_date = moment(finish_date).toDate()

    if(finish_date < start_date){
        res.render(urlv, {
            user, 
            departments: await Department.find({}), 
            messages: {type:1, message:"La fecha de cierre es antes que la de inicio.", title, department_name, body, url} 
        })
    }

    let department = await Department.findOne({name:department_name})

    if(!department){
        res.redirect('/d/new')
    }

    // image
    let newImage = new Image({
        filename: req.file.filename,
        path: '/uploads/' + req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
    })
    await newImage.save()
    
    let newNews = new News({ title, department, author:req.session.user, body, url, image: newImage, start_date, finish_date })
    await newNews.save()

    res.render(urlv, { 
        user,
        departments: await Department.find({}),
        messages: {type:2, message:"Se creo la noticia exitosamente."} 
    })
})

router.get('/list', session_active, async (req, res) => {
    let { user } = req.session,
        url = user.type > 0 ? 'news/list_admin' : 'news/list_author'

    res.render(url, {user, news: await News.find({}).populate('department author') })
})

router.get('/show/:department_name', session_active, async (req, res) => {
    let { user } = req.session,
        { department_name } = req.params

    let departments_news = null
    console.log(department_name)
    if (department_name == "TODOS"){
        departments_news = await News.find({}).populate('image author')
    }else{
        let department = await Department.findOne({name:department_name})
        departments_news = await News.find({department}).populate('image author')
    }
    console.log(departments_news)
    res.render('news/show', {user, departments_news})
})

module.exports = router