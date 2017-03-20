/*
 * Framework for SWT applications
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-19 | Nicholas M. Dantas
 */

/*
 * Module dependencies.
 */
global.CacheManager = require('lru-cache')({ /* A instancia de Gerenciador de Cache deve ser unico para todo o servidor */
    max: 1000,
    maxAge: 1000 * 600 /* Tempo Default no Cache Atual - 10 minutos */
});
var dataAccess  = require('./data-access');
var linq        = require('./common/linq');
var constants   = require('./common/constants');
var logger      = require('./security/logger');
var signature   = require('./security/signature');
var authorize   = require('./security/roles-authorization');

module.exports = init;

/**
 * Expose 'init(config: object): void'.
 */
function init(config) {
    var logService = dataAccess(config.connection).log;
    var log = logger(config.applicationId, logService);
    
    return {
        logger: {
            debug: log.saveDebug,
            error: log.saveError
        },
        middlewares: {
            log: log.middleware,
            authorize: authorize
        },
        security: {
            signature: signature 
        },
        constants: {
            add: constants.add
        }
    }
}