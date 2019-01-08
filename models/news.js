const   mongoose = require('mongoose'),
        { Schema } = mongoose

const News = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "Author",
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
        unique: true,
        trim: true
    },
    publication_date:{
        type: Date
    },
    start_date:{
        type: Date
    },
    finish_date:{
        type: Date
    }
})

module.exports =  mongoose.model('News', News, "News")