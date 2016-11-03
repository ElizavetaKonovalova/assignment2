var configAuth = require('./credentials');

/*module.exports = {
    'url' : 'mongodb://localhost:27017/test'
};*/

module.exports = {
    'url' : 'mongodb://'+configAuth.documentDB.username+':'+configAuth.documentDB.password+'@' +
    'assignment2ccqut.documents.azure.com:10250/?ssl=true'
};
