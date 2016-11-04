var mongodb = require('mongoose');

var search_history = mongodb.Schema({
    id: String,
    search_key: String,
    twitter_data: String
});

module.exports = mongodb.model('SearchHistory', search_history);

