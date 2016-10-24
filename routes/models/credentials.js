var fs = require('fs');

module.exports =
{
    'twitter': {
        'access_token' : '711819644391149568-wmw4of3qrTEtJlxZWRmNXBGNXzgx0l3',
        'access_token_secret' : 'd2lvV1ovobkRYzvWDtnBqbYcNCq8AMNqxwgDRtJsFsdiY',
        'consumer_key' : 'SggHqx9U7JB4BArkgHBfMMPFy',
        'consumer_secret' : '8jkLZSzqQgSmwUqZ7XgKpqRbcJbGHqNRTnzNHC4NxuzV4Aswzf',
        'callback': '/auth/twitter/callback'
    },

    'azure' : {
        'subscription_id': 'e6062b6f-ab04-4c4a-874e-aefa2ec9c998',
        'pem': fs.readFileSync('./documents/azure.pem').toString(),
        'resourcegroup' : 'assignment2'
    }
};