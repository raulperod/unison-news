module.exports = function(req, res, next){
    let { user } = req.session
    if( user ){
        if( user.type == 1 ){
            next()
        } else {
            res.redirect('/u/login')
        }
    }else{
        res.redirect("/u/login")
    }
}