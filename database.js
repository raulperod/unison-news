const   mongoose = require('mongoose'),
        URI = process.env.DB || 'mongodb://localhost:27017/unison-news'

mongoose.connect(URI, { useNewUrlParser: true })
    .then(DB => console.log('DB is conected'))
    .catch(err => console.error(err))

module.exports = mongoose