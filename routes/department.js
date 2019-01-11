const   router = require('express').Router(),
        Departament = require('../models/department'),
        admin = require('../middlewares/admin_session')

router.get('/new', admin, async (req, res) => {
    res.render('departments/new', {user: req.session.user, messages: {type:0, message:""} })
})

router.post('/new', admin, async (req, res) => {
    let { name } = req.body
    
    if(await Departament.findOne({name})){
        res.render('departments/new', {
            messages: {type:1, message:"Ya existe un departamento con ese nombre.", name}
        })
        return
    } 

    let newDepartment = new Departament({name})
    await newDepartment.save()

    res.render('departments/new', { 
        messages: {type:2, message:"Se creo el departamento exitosamente."} 
    })
})

router.get('/list', admin, async (req, res) => {
    res.render('departments/list', {user:req.session.user, departments: await Departament.find({})})
})

module.exports = router