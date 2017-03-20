/*
 * Module to log information, warnigs and errors.
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-19 | Nicholas M. Dantas
 */

'use strict';

/*
 * Module dependencies.
 */
var logService  = require('./../data-access').log;

module.exports = {
    saveDebug: saveDebug,
    saveError: saveError,
    middleware: middleware
};

function saveDebug(message, source) {
    logService.add({
        level: global.Application.LOG_LEVEL.Debug,
        message: message,
        source: source,
        applicationId: process.env.APPLICATION_ID
    });
}

function saveError(exception, source) {
    logService.add({
        level: global.Application.LOG_LEVEL.Exception,
        message: exception.message,
        source: source || '',
        stackTrace: exception.stack,
        applicationId: process.env.APPLICATION_ID
    });
}

function middleware() {
    return function(err, req, res, next) {
        console.log('[Error Middleware] Time: ', Date.now());

        res.status(500).json({
            errorCode: err.code,
            errorMessage: global.Application.ERROR_CODES[err.code] || ''
        });
    }
}