'use strict';
module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({name: "ERROR", message: err});
    }

    if (err.name === 'ValidationError') {
        return res.status(422).json({name: err.name, message: err.message});
    }

    if (err.name === 'InvalidCredential') {
        return res.status(422).json({name: 'ValidationError', message: err.message});
    }

    if (err.name === 'UnauthorisedError') {
        return res.status(401).json({name: err.name, message: "Invalid Token"});
    }

    if (err.name === 'PermissionDeniedError') {
        return res.status(403).json({name: err.name, message: "Permission Denied"});
    }

    if (err.name === 'NotFound') {
        return res.status(404).json({name: err.name, message: "Resource Not Found"});
    }


    // default to 500 server error
    return res.status(500).json({ message: err.message });
}
