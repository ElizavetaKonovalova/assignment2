var configAuth = require('./credentials');

module.exports = {
    'url' : 'mongodb://' + configAuth.documentDB.username + ':' + configAuth.documentDB.password +
    '@assignment2ccqutstore.documents.azure.com:10250/database?ssl=true'
};