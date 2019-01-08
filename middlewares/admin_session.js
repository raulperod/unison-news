module.exports = function(req, res, next){
    let { user } = req.session
    if( user ){
        if( user.permit > 0 ){
            next()
        } else {
            res.redirect('')
        }
    }else{
        res.redirect("")
    }
}