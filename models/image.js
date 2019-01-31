const   mongoose = require('mongoose'),
        { Schema } = mongoose

const Image = new Schema({
    filename: {
        type: String,
        required: true,
        trim: true
    },
    path: {
        type: String,
        required: true,
        trim: true
    },
    originalname: {
        type: String,
        required: true,
        trim: true
    },
    mimetype: {
        type: String,
        required: true,
        trim: true
    },
    size: {
        type: String,
        required: true,
        trim: true
    },
})

module.exports = mongoose.model('Image', Image);