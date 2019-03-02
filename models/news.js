const   mongoose = require('mongoose'),
        { Schema } = mongoose

const News = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: "Department",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: "Image",
        required: true
    },
    publication_date:{
        type: Date,
        default: Date.now,
        required: true
    },
    start_date:{
        type: Date,
        required: true
    },
    finish_date:{
        type: Date,
        required: true
    }
})

module.exports =  mongoose.model('News', News, "news")