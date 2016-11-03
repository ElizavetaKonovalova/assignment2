var mongodb = require('mongoose');

var search_history = mongodb.Schema({

    twitter_search_schema:
    {
        id: String,
        search_key : String,
        sentiment: String,
        keywords: String,
        cliche: String
    }
});

module.exports = mongodb.model('SearchHistory', search_history);

