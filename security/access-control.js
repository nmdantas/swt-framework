/*
 * Middlewares to control access in an application.
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-20 | Nicholas M. Dantas
 */

/*
 * Module dependencies.
 */
var common      = require('./../common');
var dataAccess  = require('./../data-access');

module.exports = {
    enablePreflight: enablePreflight,
    checkAuthorization: checkAuthorization
}

function enablePreflight(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept, X-Requested-With, Accept-Encoding');

    next();
}

function checkAuthorization(req, res, next) {
    var authHeader = common.parseAuthHeader(req.headers.authorization);

    switch (authHeader.type) {
        case 'app':
            // Verifica se o token é da respectiva applicacao
            if (authHeader.token === process.env.APPLICATION_TOKEN) {
                next();
            } else {
                sendUnauthorizedResponse(req, res);
            }
        break;

        case 'basic':
            // Verifica se o usuario esta logado
            if (global.CacheManager.has(authHeader.token)) {
                next();
            } else {
                sendUnauthorizedResponse(req, res);
            }
        break;

        default:
            sendUnauthorizedResponse(req, res);
        break;
    }
}

function sendUnauthorizedResponse(req, res) {
    res.headers['WWW-Authenticate'] = 'Basic realm="' + process.env.APPLICATION_REALM + '"';

    res.status(401).json({
        errorCode: 401,
        errorMessage: 'Unauthorized'
    });
}