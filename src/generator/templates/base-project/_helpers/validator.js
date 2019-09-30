'use strict';
const async = require('async');
const sequencer = require('./sequence');
/**
 * VALIDATOR FUNCTION
 * AUTHOR: Sunil Kr. Samanta
 * @param CONNECTION -> Mongo Connection
 * @param data -> post Data
 * @param Model -> Model instance
 * @param validation_type -> insert/update
 * @param instance_id -> For Update unique checking, current instance's primary key
 * @param cb -> Callback
 */
module.exports.validatePostData = function (CONNECTION, data, Model, validation_type, instance_id, cb) {
  let properties = Model.properties;

  let validationErrors = {};
  let allKeys = Object.keys(properties);
  if(validation_type === 'update'){
    let primary_key = getPrimaryKeyFromModel(Model);
    // Delete Primary Key Field if exists in the data while Update

    delete data[primary_key];
    allKeys = Object.keys(data);
  }

  async.each(allKeys,
    // 2nd param is the function that each item is passed to
    function(key, callback){
      if (!properties[key].primary_key) {
        let currentError = [];
        if(properties[key].required && properties[key].default === undefined ){
          if(!data[key]){
            // Error
            currentError.push('is Required');
          }
        }

        if(data[key]){
          // Type Check
          switch(properties[key].type){
            case 'string':
              if(typeof data[key] !== "string"){
                currentError.push('is not a valid String');
              }
              break;

            case 'number':
              if(typeof data[key] !== "number"){
                currentError.push('is not a valid Number');
              }
              break;

            case 'date':
              let dateRe = /^(?:[\+-]?\d{4}(?!\d{2}\b))(?:(-?)(?:(?:0[1-9]|1[0-2])(?:\1(?:[12]\d|0[1-9]|3[01]))?|W(?:[0-4]\d|5[0-2])(?:-?[1-7])?|(?:00[1-9]|0[1-9]\d|[12]\d{2}|3(?:[0-5]\d|6[1-6])))(?:[T\s](?:(?:(?:[01]\d|2[0-3])(?:(:?)[0-5]\d)?|24\:?00)(?:[\.,]\d+(?!:))?)?(?:\2[0-5]\d(?:[\.,]\d+)?)?(?:[zZ]|(?:[\+-])(?:[01]\d|2[0-3]):?(?:[0-5]\d)?)?)?)?$/;
              if(!dateRe.test(data[key])){
                currentError.push('is not a valid Date');
              }else{
                data[key] = new Date(data[key]);
              }
              break;

            case 'email':
              let emailRe = /\S+@\S+\.\S+/;
              if(!emailRe.test(data[key])){
                currentError.push('is not a valid Email');
              }
              break;

            case 'tel':
              let phoneRe = /^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x/#]{1}(\d+))?\s*$/;
              if(!phoneRe.test(data[key])){
                currentError.push('is not a valid Phone Number');
              }
              break;
            case 'array':
              if(typeof data[key]!=='object' || !Array.isArray(data[key])){
                currentError.push('is not a valid Array');
              }
              break;

            case 'object':
              if(typeof data[key] !== "object"){
                currentError.push('is not a valid Object');
              }
              break;

            case 'enum':
              if(properties[key].enum.indexOf(data[key]) === -1){
                currentError.push('is not a valid entry');
              }
              break;

            default:
          }
        }

        // Set Default values
        if(properties[key].required && !data[key] ){
          if(properties[key].type === "date"){
            if(properties[key].default === "now"){
              data[key] = new Date();
            }else{
              data[key] = new Date(properties[key].default);
            }
          }else{
            data[key] = properties[key].default;
          }

        }

        // Unique check
        if(properties[key].unique){
          checkUnique(CONNECTION,Model,key,data[key],validation_type,instance_id,function (isUnique) {
            if(isUnique){


              if(currentError.length > 0){
                validationErrors[key] = currentError;
              }

              callback();
            }else{
              currentError.push('value should be unique');
              // Set Default values

              if(currentError.length > 0){
                validationErrors[key] = currentError;
              }
              callback();

            }
          });
        }else{

          // Set Default values
          if(properties[key].required && !data[key] ){
            data[key] = properties[key].default;
          }

          if(currentError.length > 0){
            validationErrors[key] = currentError;
          }

          callback();
        }
      }else{
        callback();
      }

    },
    // 3rd param is the function to call when everything's done
    function(err){
      // All tasks are done now
      if(!err){
        let primary_key = getPrimaryKeyFromModel(Model);
        if (Object.keys(validationErrors).length === 0) {
          if(validation_type === 'insert'){
            generatePrimaryKey(CONNECTION, Model, function (err, primaryKeyValue) {
              if (err) {
                cb(err);
              } else {
                // Now Validate
                data[primary_key] = primaryKeyValue;
                cb(null, data);
              }
            });
          }else{
            data.updated_date = new Date();
            cb(null, data);
          }

        } else {
          let errorMessages = {};
          Object.keys(validationErrors).forEach(key => {
            errorMessages[key] = validationErrors[key].join(', ');

          });
          let error = new Error();
          error.name = "ValidationError";
          error.status = 422;
          error.message = errorMessages;
          cb(error);
        }
      }else{
        cb(err);
      }
    }
  );
};



/**
 * GENERATE PRIMARY KEY
 * @param CONNECTION
 * @param Model
 * @param cb
 */
let generatePrimaryKey = function (CONNECTION, Model, cb) {
  let collectionName = Model.collectionName;
  sequencer.generateSequence(CONNECTION, collectionName, (err, value) => {
    cb(err, value);
  });
};

/**
 * CHECK UNIQUE
 * @param CONNECTION
 * @param Model
 * @param field_name
 * @param value
 * @param validation_type -> insert/update
 * @param instance_id
 * @param cb
 */

let checkUnique = function (CONNECTION, Model, field_name, value, validation_type, instance_id, cb) {
  let collection = CONNECTION.collection(Model.collectionName);

  let primary_key = getPrimaryKeyFromModel(Model);
  let condition = {};
  condition[field_name] = value;
  if (validation_type === 'update') {
    condition[primary_key] = {$ne: instance_id};
  }

  collection.countDocuments(condition, function (err, instanceCount) {
    //console.log(err, instanceCount);
    if (err) {
      cb(false);
    } else {
      if (instanceCount > 0) {
        cb(false);
      } else {
        cb(true);
      }
    }
  });

};


/**
 * GET PRIMARY KEY FIELD FROM MODEL
 * @param Model
 * @returns {string} Primary Key Field name
 */

let getPrimaryKeyFromModel = function (Model) {
  let primary_key = null;
  Object.keys(Model.properties).forEach(key => {
    if (Model.properties[key].primary_key) {
      primary_key = key;
    }
  });

  return primary_key;
};
