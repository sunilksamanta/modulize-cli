'use strict';
const accessTokenCollectionName = require('../modules/auth/auth.settings').accessTokenCollection;
module.exports = function (dbs) {
  return function (req, res, next) {
      if (req.headers.authorization) {
        let currentToken = req.headers.authorization.split(' ')[1];
        if (currentToken) {
          let accessTokenCollection = dbs.collection(accessTokenCollectionName);
          accessTokenCollection.findOne({token: currentToken}, function (err, tokenData) {
            if (err) {
              console.log(err);
              let error = new Error("Connectivity Error");
              next(error);
            } else {
              if (tokenData) {
                delete tokenData._id;
                req.authorization = tokenData;
                next();
              } else {
                let error = new Error();
                error.name = 'UnauthorisedError';
                next(error);
              }
            }
          });
        } else {
          let error = new Error();
          error.name = 'UnauthorisedError';
          next(error);
        }
      } else {
        let error = new Error();
        error.name = 'UnauthorisedError';
        next(error);
      }
    };

};
