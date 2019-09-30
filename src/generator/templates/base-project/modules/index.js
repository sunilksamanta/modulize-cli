'use strict';
const express = require('express');
const router = express.Router();

let AUTH_MODULE = require('./auth');

module.exports = function (app, dbs) {

  router.use('/auth', AUTH_MODULE(app,dbs));

  // Not Found Route
  router.use('*', function (req, res,next) {
    const error = new Error();
    error.name = "NotFound";
    next(error);
  });
  return router;
};
