/*
 * Data access (MySql)
 *
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-19 | Nicholas M. Dantas
 */

'use strict';

/*
 * Module dependencies.
 */
var database    = require('mysql');
var logService  = require('./log');

module.exports = init;

function init(connectionConfig) {
    var logConnectionPool = database.createPool(connectionConfig);
    
    return {
        log: logService(logConnectionPool)
    };
}