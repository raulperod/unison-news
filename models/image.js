const   mongoose = require('mongoose'),
        { Schema } = mongoose

const Image = new Schema({
    filename: {
        type: String,
        required: true,
        trim: true
    },
    imageURL: {
        type: String,
        required: true,
        trim: true
    },
    public_id: {
        type: String,
        required: true,
        trim: true
    }
})

module.exports = mongoose.model('Image', Image);