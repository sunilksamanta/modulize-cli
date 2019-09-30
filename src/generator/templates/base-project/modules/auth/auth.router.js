'use strict';
const express = require('express');
const router = express.Router();
const model = require('./auth.model');

module.exports = function(app, dbs){
    let authorization = require('../../_helpers/authorization')(dbs);

    router.post('/register', (req, res, next) => {
        model.register(dbs, req, res, function (err, response) {
            if (err) {
                next(err);
            } else {
                res.json({data: response});
            }
        });
    });

    router.post('/login', (req, res, next) => {
        model.login(dbs, req, res, function (err, response) {
            if (err) {
                next(err);
            } else {
                res.json({data: response});
            }
        });
    });

    router.get('/logout', authorization, (req, res, next) => {
        model.logout(dbs, req, res, function (err, response) {
            if (err) {
                next(err);
            } else {
                res.json({data: response});
            }
        });
    });
    return router;
};
