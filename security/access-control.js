/*
 * Middlewares to control access in an application.
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-20 | Nicholas M. Dantas
 */

/*
 * Module dependencies.
 */
var dataAccess = require('./../data-access');

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
    var authorization = req.headers.authorization || '';
    var authRegex = new RegExp(/(Basic|App)\s+/ig);
    var authType = authRegex.test(authorization) ? authRegex.exec(authorization)[0].toLowerCase() : '';
    var key = authorization.replace(authRegex, '').toLowerCase();

    switch (authType) {
        case 'basic':
            var successCallback = () => {
                next();
            }

            var errorCallback = (error) => {
                error = error || new Error();
                error.code = 'APP004';

                logManager.saveError(error, 'swtFramework.security.accessControl.checkAuthorization');
                        
                next(error);
            }

            // Verifica se a aplicacao existe
            dataAccess.app.exists(key, successCallback, errorCallback);
        break;

        case 'app':
            // Verifica se o usuario esta logado
            if (global.CacheManager.has(key)) {
                next();
            } else {
                res.status(401).json({
                    errorCode: 401,
                    errorMessage: 'Unauthorized'
                });
            }
        break;

        default:
            res.status(401).json({
                errorCode: 401,
                errorMessage: 'Unauthorized'
            });
        break;
    }
}