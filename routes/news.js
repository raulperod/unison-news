const   router = require('express').Router(),
        News = require('../models/news'),
        Department = require('../models/department'),
        Image = require('../models/image'),
        { unlink } = require('fs-extra'),
        path = require('path'),
        session_active = require('../middlewares/session_active'),
        moment = require('moment'),
        cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
})

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
        return
    }

    let department = await Department.findOne({name:department_name})

    if(!department){
        res.redirect('/d/new')
        return
    }
    // cloudinary
    const rimage = await cloudinary.v2.uploader.upload(req.file.path)
    // image
    let newImage = new Image({
        filename: req.file.filename,
        imageURL: rimage.secure_url,
        public_id: rimage.public_id
    })
    await newImage.save()
    await unlink(req.file.path)
    
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

router.get('/edit/:idNews', session_active, async (req, res) => {
    let { idNews } = req.params,
        { user } = req.session,
        url = user.type > 0 ? 'news/edit_admin' : 'news/edit_author'

    let news = await News.findById(idNews).populate('author department')

    res.render(url, {user, news, departments: await Department.find({}), messages: {type:0, message:""} })
})

router.post('/edit/:idNews', session_active, async (req, res) => {
    let { user } = req.session,
        { idNews } = req.params,
        { title } = req.body,
        { department_name } = req.body,
        { body } = req.body,
        { url } = req.body,
        { start_date } = req.body,
        { finish_date } = req.body,
        urlv = user.type > 0 ? 'news/edit_admin' : 'news/edit_author'
        
    // string to date
    start_date = moment(start_date).toDate()
    finish_date = moment(finish_date).toDate()

    if(finish_date < start_date){
        res.render(urlv, {
            user, 
            departments: await Department.find({}), 
            messages: {type:1, message:"La fecha de cierre es antes que la de inicio.", title, department_name, body, url, start_date, finish_date} 
        })
        return
    }

    let department = await Department.findOne({name:department_name})

    if(!department){
        res.redirect('/d/new')
        return
    }

    let updateNews = await News.findById(idNews).populate('image')
    updateNews.title = title
    updateNews.department = department
    updateNews.author = req.session.user
    updateNews.body = body
    updateNews.url= url
    // delete and update image
    if (req.file !== undefined){
        let updateImage = updateNews.image
        // delete image from server
        await cloudinary.v2.uploader.destroy(updateImage.public_id);
        // upload image to cloudinary
        const rimage = await cloudinary.v2.uploader.upload(req.file.path)
        // update image
        updateImage.filename = req.file.filename
        updateImage.imageURL = rimage.secure_url
        updateImage.public_id = rimage.public_id
        await updateImage.save()
        await unlink(req.file.path)
    }
    
    updateNews.start_date = start_date
    updateNews.finish_date = finish_date

    await updateNews.save()

    res.redirect('/n/list')
})

router.get('/delete/:idNews', session_active, async (req, res) => {
    let { idNews } = req.params

    let deleteNews = await News.findById(idNews).populate('image')
    await cloudinary.v2.uploader.destroy(deleteNews.image.public_id);
    await Image.findByIdAndDelete(deleteNews.image._id)
    await News.findByIdAndDelete(idNews)
    res.redirect('/n/list')
})

router.get('/show/:department_name', async (req, res) => {
    let { department_name } = req.params
    const current_time = moment().toDate()
    let departments_news = null
    
    if (department_name == "TODOS"){
        departments_news = await News.find( {$and: [ { start_date: { $lte: current_time } }, { finish_date: { $gte: current_time } } ]} ).populate('image').sort('-start_date').limit(20)
    }else{
        let department = await Department.findOne({name:department_name})
        departments_news = await News.find( { department, $and: [ { start_date: { $lte: current_time } }, { finish_date: { $gte: current_time } } ]} ).populate('image').sort('-start_date').limit(20)
    }
    
    res.render('news/show', {departments_news})
})

router.post('/getnews', async (req, res) => {
    const current_time = moment().toDate()
    let news = await News.find( {$and: [ { start_date: { $lte: current_time } }, { finish_date: { $gte: current_time } } ]} ).populate('image').sort('-start_date').limit(20)
    res.json({ news })
})

module.exports = router