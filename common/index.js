/*
 * Common functions for general use
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-25 | Nicholas M. Dantas
 */

'use strict';

/*
 * Module dependencies.
 */
var validate    = require('validate.js');
// Mensagem padrão para campo obrigatório
validate.validators.presence.message = "é obrigatório(a)";

module.exports = {
    parseAuthHeader: parseAuthHeader,
    validate: validate
};

/**
 * Parse the Authorization header to json
 * 
 * parseAuthHeader(authorization: string): Object 
 * {
 *     type: ('app' | basic' | 'bearer' | etc...),
 *     token: 'access_token'
 * }.
 */
function parseAuthHeader(authorization) {
    authorization = authorization || '';

    var authRegex = new RegExp(/(App|Basic|Bearer)\s+/ig);
    var matches = authRegex.exec(authorization);
    var authType = matches ? matches[1].toLowerCase() : '';
    var key = authorization.replace(authRegex, '').toLowerCase();

    return {
        type: authType,
        token: key
    };
}