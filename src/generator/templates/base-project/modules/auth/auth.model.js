'use strict';
const settings = require('./auth.settings.json');
const bcrypt = require('bcryptjs');
const SALT = bcrypt.genSaltSync(10);
const cryptoRandomString = require('crypto-random-string');
const ip = require('ip');
const validator = require('../../_helpers/validator');
const model = require('./auth.settings');

module.exports.register = function(CONNECTION, req, res, callback){
    let userCollection = CONNECTION.collection(settings.collectionName);
    let body = req.body;

    validator.validatePostData(CONNECTION, body, model, 'insert', 0, (err, validatedData) => {
        if(err) {
            callback(err);
            return;
        }
        validatedData.password = bcrypt.hashSync(validatedData.password, SALT);
        userCollection.insertOne(validatedData, (err, inserted) => {
            if(err) {
                callback(err);
            }else {
                callback(null, {message: "Registration Successful"});
            }
        });
    });
};

module.exports.login = function(CONNECTION, req, res, callback){
    let adminCollection = CONNECTION.collection(settings.collectionName);
    let accessTokenCollection = CONNECTION.collection(settings.accessTokenCollection);
    let body = req.body;
    if(!body.email || !body.password) {
      let vErr = new Error();
      vErr.name = 'ValidationError';
      vErr.message = "Email or Password can not be blank";
      callback(vErr);
    } else{
      adminCollection.findOne({email:body.email}, function (err, userData) {
        if(err){
          callback(err);
        }else{
          if(userData){
            // User Found
            let passwordFromDb = userData.password;
            if(bcrypt.compareSync(body.password,passwordFromDb)){
              // Matched!!!
              let userDetails = { ...userData};
              delete userDetails.password;
              let exp = new Date();
              exp.setHours(exp.getHours() + 24);
              // Modify user Details to be sent
              delete userDetails.password;
              let accessTokenData = {
                token: cryptoRandomString(128),
                user_id: userData.user_id,
                login_time: new Date(),
                expiry: exp,
                login_ip: ip.address(),
                userDetails: userDetails
              };
              accessTokenCollection.insertOne(accessTokenData, function (err, response) {
                if(err){
                  // console.log(err);
                  let error = new Error("Some error occurred while login");
                  callback(error);
                }else{
                  // Successfully Logged in
                  delete accessTokenData._id;
                  req.authorization = accessTokenData;
                  callback(null, accessTokenData);
                }
              });
            }else{
              let vErr = new Error();
              vErr.name = 'InvalidCredential';
              vErr.message = "Invalid Password";
              callback(vErr);
            }
          }else{
            let vErr = new Error();
            vErr.name = 'InvalidCredential';
            vErr.message = "Invalid Email";
            callback(vErr);
          }
        }
      });
    }

};



module.exports.logout = function (CONNECTION, req, res, callback) {
    let currentToken = req.authorization.token;
    let accessTokenCollection = CONNECTION.collection(settings.accessTokenCollection);
    accessTokenCollection.deleteOne({token: currentToken},(err, docs) => {
        if (err) {
            callback(err);
        }else{
            let output = {
                logout: true
            };
            callback(null, output);
        }
    });
};
