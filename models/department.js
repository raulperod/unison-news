const   mongoose = require('mongoose'),
        { Schema } = mongoose

const Department = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
})

module.exports =  mongoose.model('Department', Department)