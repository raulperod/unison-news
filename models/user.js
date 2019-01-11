const   mongoose = require('mongoose'),
        bcrypt = require('bcrypt-nodejs'),
        { Schema } = mongoose

const User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: Number,
        required: true,
        enum:{
            values: [0, 1], // autor, admin
            message: "Invalid Option"
        }
    }
})

User.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
  
User.methods.comparePassword= function (password) {
    return bcrypt.compareSync(password, this.password)
}

module.exports =  mongoose.model('User', User)