/*
 * Module to log information, warnigs and errors.
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-19 | Nicholas M. Dantas
 */

'use strict';

module.exports = function(applicationId, dataAccess) {
    function saveDebug(message, source) {
        dataAccess.log.add({
            level: global.Application.LOG_LEVEL.Debug,
            message: message,
            source: source,
            applicationId: applicationId
        });
    }

    function saveError(exception, source) {
        dataAccess.log.add({
            level: global.Application.LOG_LEVEL.Exception,
            message: exception.message,
            source: source || '',
            stackTrace: exception.stack,
            applicationId: applicationId
        });
    }

    return {
        saveDebug: saveDebug,
        saveError: saveError,
        middleware: middleware
    };
};

function middleware() {
    return function(err, req, res, next) {
        console.log('[Error Middleware] Time: ', Date.now());

        res.status(500).json({
            errorCode: err.code,
            errorMessage: global.Application.ERROR_CODES[err.code] || ''
        });
    }
}