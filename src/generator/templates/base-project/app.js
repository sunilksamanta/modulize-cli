'use strict';
const bodyParser = require('body-parser');
const errorHandler = require('./_helpers/error-handler');
const MODULE_LOADER = require('./modules');
const cors = require('cors');
const path = require('path');
module.exports = function(app, dbs) {
  // App Configuration
  app.use(cors());
  app.options('*', cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Load Required Modules
  app.use('/api', MODULE_LOADER(app,dbs));


  // Not Found Routes
  app.use('*', function (req, res,next) {
    const error = new Error();
    error.name = "NotFound";
    next(error);
  });

  // Global Error Handler
  app.use(errorHandler);
  return app
};
