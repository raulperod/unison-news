const   router = require('express').Router(),
        Department = require('../models/department'),
        News = require('../models/news'),
        admin = require('../middlewares/admin_session')

router.get('/new', admin, async (req, res) => {
    res.render('departments/new', {user: req.session.user, messages: {type:0, message:""} })
})

router.post('/new', admin, async (req, res) => {
    let { name } = req.body
    
    if(await Department.findOne({name})){
        res.render('departments/new', {
            messages: {type:1, message:"Ya existe un departamento con ese nombre.", name}
        })
        return
    } 

    let newDepartment = new Department({name})
    await newDepartment.save()

    res.render('departments/new', { 
        messages: {type:2, message:"Se creo el departamento exitosamente."} 
    })
})

router.get('/list', admin, async (req, res) => {
    res.render('departments/list', {user:req.session.user, departments: await Department.find({})})
})

router.get('/edit/:name', admin, async (req, res) => {
    let { name } = req.params
    
    if(department = await Department.findOne({name})){
        res.render('departments/edit', {user:req.session.user, department, messages:{type:0, message:""}})        
        return
    }
    res.redirect('/d/list')
})

router.post('/edit/:name', admin, async (req, res) => {
    let { id } = req.body,
        { name } = req.body
    if(await Department.findOne({name})){
        department = await Department.findById(id)
        res.render('departments/edit', {user:req.session.user,
            messages: {type:1, message:"Ya existe un departamento con ese nombre.", department}
        })
        return
    }
    await Department.findByIdAndUpdate(id, {name})
    res.redirect('/d/list')
})

router.get('/delete/:name', admin, async (req, res) => {
    let { name } = req.params
    const department = await Department.findOne({name})
    if(!department){
        res.redirect('/d/list')
        return    
    }
    // finding the news with that department
    let news_department = await News.find({department}),
        TODOS_department = await Department.findOne({name:"TODOS"})

    news_department.forEach( news => {
        news.department = TODOS_department
        news.save()
    })

    await Department.findByIdAndDelete(department._id)
    res.redirect('/d/list')
})

module.exports = router