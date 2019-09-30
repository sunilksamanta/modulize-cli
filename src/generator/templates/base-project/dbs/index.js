'use strict';
const MongoClient = require('mongodb').MongoClient;
const dbConfig = require('../config/db-config');

// Note: A production application should not expose database credentials in plain text.

let MONGO_URI = dbConfig.mongoURI;

function connect(url) {
    return MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(client => client.db(dbConfig.dbName))
}

module.exports = async function () {
    let databases = await Promise.all([connect(MONGO_URI)]);
    return databases[0];
};
