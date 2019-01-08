const   mongoose = require('mongoose'),
        { Schema } = mongoose

const Author = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
})

module.exports =  mongoose.model('Author', Author)