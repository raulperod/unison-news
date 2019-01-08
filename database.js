const   mongoose = require('mongoose'),
        //URI = 'mongodb://localhost:27017/unison-news'
        URI = "mongodb://unison-newsuser:unis0n-n3wspa66w0rd@ds231658.mlab.com:31658/unison-news"

mongoose.connect(URI, { useNewUrlParser: true })
    .then(DB => console.log('DB is conected'))
    .catch(err => console.error(err))

module.exports = mongoose